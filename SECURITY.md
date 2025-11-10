# 🔐 Security Policy

## Supported Versions

Currently supported versions for security updates:

| Version | Supported          |
| ------- | ------------------ |
| MARK VII (latest) | ✅ Yes |
| Older versions    | ❌ No  |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

1. **Email:** [Create a private security advisory](https://github.com/Soyelijah/jarvis-mark-vii/security/advisories/new)
2. **Expected Response:** Within 48 hours

### What to Include

- Type of vulnerability
- Full description
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### What to Expect

- Acknowledgment within 48 hours
- Status update within 7 days
- Fix timeline based on severity
- Credit in release notes (if desired)

## Security Best Practices

When deploying J.A.R.V.I.S.:

### Environment Variables
- ❌ Never commit `.env` files
- ✅ Use environment-specific configs
- ✅ Rotate API keys regularly

### Network Security
- ✅ Use HTTPS in production
- ✅ Enable CORS properly
- ✅ Implement rate limiting
- ✅ Use reverse proxy (nginx)

### Authentication
- ✅ Use strong passwords
- ✅ Enable 2FA where possible
- ✅ Implement session timeouts
- ✅ Use JWT with short expiry

### Database
- ✅ Sanitize all inputs
- ✅ Use parameterized queries
- ✅ Regular backups
- ✅ Encrypt sensitive data

### Dependencies
- ✅ Run `npm audit` regularly
- ✅ Keep dependencies updated
- ✅ Review dependency changes

## Known Security Considerations

### Current Limitations

1. **Puppeteer Vulnerabilities**
   - 5 HIGH severity vulnerabilities in dependencies
   - Not critical for local deployment
   - Update recommended for production: `npm audit fix`

2. **SQLite for Production**
   - Not recommended for multi-user production
   - Migrate to PostgreSQL for scale
   - See `docs/DEPLOYMENT-GUIDE.md`

3. **Ollama Local Models**
   - Models run locally, no data leaves machine
   - Ensure model sources are trusted

## Enterprise Security

For enterprise deployments requiring:
- SOC2 compliance
- GDPR compliance
- Penetration testing
- Security audits
- Dedicated security support

Contact us via [Enterprise inquiry](https://github.com/Soyelijah/jarvis-mark-vii/issues/new?template=enterprise.md).

---

**"Security is not a feature, it's a requirement."** 🔒
