/* global process, Buffer */
/**
 * Vercel Serverless Function: /api/contact
 * Handles contact form submissions securely via Web3Forms.
 * 
 * Security & Reliability Specifications:
 * 1. Method Restriction: POST requests only (rejects all other methods with 405).
 * 2. Secret Protection: Uses process.env.WEB3FORMS_ACCESS server-side only; never exposes it.
 * 3. Zero PII Logging: No names, emails, subjects, or messages are ever logged.
 * 4. Spam Defense: Honeypot field (botcheck) silently succeeds without forwarding to API.
 * 5. Input Validation: HTML5/W3C-style email regex validation with RFC 5321 length check.
 * 6. Request Size Limit: Rejects payloads exceeding 10 KB with HTTP 413.
 * 7. Field Length Bounds: Enforces reasonable character maximums to prevent payload abuse.
 * 8. Upstream Timeout: AbortSignal.timeout(10000) prevents hung serverless execution.
 */

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const MAX_BODY_BYTES = 10 * 1024; // 10 KB

export default async function handler(req, res) {
  // 1. Accept POST requests only
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Only POST requests are accepted.'
    });
  }

  // 2. Enforce early request-body size limit (10 KB)
  const contentLengthHeader = req.headers?.['content-length'];
  if (contentLengthHeader) {
    const contentLength = parseInt(contentLengthHeader, 10);
    if (!Number.isNaN(contentLength) && contentLength > MAX_BODY_BYTES) {
      return res.status(413).json({
        success: false,
        message: 'Request payload exceeds maximum allowed size (10 KB).'
      });
    }
  }

  // Fallback body size verification (for chunked transfers or missing Content-Length header)
  if (typeof req.body === 'string' && Buffer.byteLength(req.body, 'utf8') > MAX_BODY_BYTES) {
    return res.status(413).json({
      success: false,
      message: 'Request payload exceeds maximum allowed size (10 KB).'
    });
  } else if (req.body && typeof req.body === 'object') {
    try {
      if (Buffer.byteLength(JSON.stringify(req.body), 'utf8') > MAX_BODY_BYTES) {
        return res.status(413).json({
          success: false,
          message: 'Request payload exceeds maximum allowed size (10 KB).'
        });
      }
    } catch {
      // If serialization fails, downstream parsing/validation handles it
    }
  }

  // 3. Read Web3Forms access key from server environment
  const accessKey = process.env.WEB3FORMS_ACCESS?.trim();
  if (!accessKey) {
    console.error('[Contact API]: Server misconfiguration - missing WEB3FORMS_ACCESS environment variable.');
    return res.status(500).json({
      success: false,
      message: 'Contact service is temporarily misconfigured. Please use the direct email link.'
    });
  }

  // 4. Parse request payload
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON payload.'
      });
    }
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'Request body must be a valid JSON object.'
    });
  }

  const {
    name: rawName,
    firstName: rawFirstName,
    lastName: rawLastName,
    email: rawEmail,
    subject: rawSubject,
    message: rawMessage,
    botcheck
  } = body;

  // 4. Honeypot check: If the hidden botcheck field is populated, silently drop
  if (botcheck) {
    return res.status(200).json({
      success: true,
      message: 'Message delivered successfully.'
    });
  }

  // 5. Normalization & Input Validation
  const name = (rawName || `${rawFirstName || ''} ${rawLastName || ''}`).trim();
  const email = (rawEmail || '').trim();
  const subject = (rawSubject || 'Operations & Analytics Discussion').trim();
  const message = (rawMessage || '').trim();

  // Validate required fields
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Name is required.'
    });
  }

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email address is required.'
    });
  }

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message content is required.'
    });
  }

  // Enforce sensible character length limits
  if (name.length > 120) {
    return res.status(400).json({
      success: false,
      message: 'Name exceeds maximum allowed length (120 characters).'
    });
  }

  if (subject.length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Subject exceeds maximum allowed length (200 characters).'
    });
  }

  if (message.length > 5000) {
    return res.status(400).json({
      success: false,
      message: 'Message exceeds maximum allowed length (5000 characters).'
    });
  }

  // 6. Upstream dispatch to Web3Forms API
  try {
    const upstreamResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        subject: `[Portfolio Inquiry] ${subject}`,
        message,
        from_name: 'Portfolio Contact Form'
      }),
      signal: AbortSignal.timeout(10000)
    });

    const data = await upstreamResponse.json().catch(() => null);

    if (upstreamResponse.ok && data?.success) {
      return res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully. Thank you for connecting.'
      });
    }

    // Upstream rejection or error
    console.error('[Contact API]: Web3Forms upstream response status:', upstreamResponse.status);
    return res.status(upstreamResponse.status >= 500 ? 502 : 400).json({
      success: false,
      message: data?.message || 'Unable to deliver message at this time. Please try the direct email link.'
    });
  } catch (error) {
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      console.error('[Contact API]: Web3Forms request timed out.');
      return res.status(504).json({
        success: false,
        message: 'Delivery gateway timed out. Please try again or use direct email.'
      });
    }

    console.error('[Contact API]: Network exception communicating with Web3Forms.');
    return res.status(502).json({
      success: false,
      message: 'Network error communicating with the delivery gateway. Please use direct email.'
    });
  }
}
