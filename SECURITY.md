# Security Policy

## 🔒 Supported Versions

We actively maintain and provide security updates for the following versions of `ngxsmk-datepicker`:

| **Version** | **Supported** | **Security Updates** | **End of Life** |
|:------------|:--------------|:-------------------|:----------------|
| 1.3.x | ✅ Yes | ✅ Yes | TBD |
| 1.2.x | ✅ Yes | ✅ Yes | 2025-06-01 |
| 1.1.x | ⚠️ Limited | ✅ Yes | 2025-03-01 |
| 1.0.x | ❌ No | ❌ No | 2024-12-01 |
| < 1.0 | ❌ No | ❌ No | 2024-06-01 |

### Security Update Schedule

- **Critical vulnerabilities**: Fixed within 24-48 hours
- **High severity**: Fixed within 1 week
- **Medium severity**: Fixed within 2 weeks
- **Low severity**: Fixed within 1 month

## 🚨 Reporting a Vulnerability

If you believe you have found a security vulnerability in `ngxsmk-datepicker`, please **DO NOT** open a public GitHub issue.

### How to Report

1. **Email**: Send details to [sachindilshan040@gmail.com](mailto:sachindilshan040@gmail.com)
2. **Subject**: Use "SECURITY: [Brief description]" format
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Fix Development**: Within 14 days (critical) / 30 days (others)
- **Public Disclosure**: After fix is released

## 🛡️ Security Features

### Built-in Security Measures

- **XSS Protection**: All user inputs are sanitized
- **CSRF Protection**: Built-in CSRF token validation
- **Input Validation**: Strict type checking and validation
- **Safe DOM Manipulation**: Uses Angular's safe DOM APIs
- **Content Security Policy**: Compatible with strict CSP headers

### Security Best Practices

1. **Always use the latest version**
2. **Keep dependencies updated**
3. **Implement proper input validation**
4. **Use HTTPS in production**
5. **Regular security audits**

## 🔍 Security Audit

### Regular Security Checks

- **Dependency Scanning**: Automated vulnerability scanning
- **Code Review**: Security-focused code reviews
- **Penetration Testing**: Regular security testing
- **Third-party Audits**: External security assessments

### Security Tools Integration

- **Snyk**: Dependency vulnerability scanning
- **OWASP ZAP**: Security testing
- **ESLint Security**: Code security linting
- **npm audit**: Package vulnerability checking

## 📋 Security Checklist

### For Developers

- [ ] Use latest stable version
- [ ] Validate all user inputs
- [ ] Implement proper error handling
- [ ] Use secure coding practices
- [ ] Regular dependency updates
- [ ] Security testing in CI/CD

### For Users

- [ ] Keep library updated
- [ ] Implement proper validation
- [ ] Use HTTPS in production
- [ ] Regular security audits
- [ ] Monitor security advisories
- [ ] Report vulnerabilities responsibly

## 🚀 Security Updates

### Update Process

1. **Vulnerability Discovery**: Internal or external report
2. **Assessment**: Severity and impact analysis
3. **Fix Development**: Secure patch development
4. **Testing**: Comprehensive security testing
5. **Release**: Coordinated release with disclosure
6. **Communication**: Public security advisory

### Communication Channels

- **GitHub Security Advisories**: [GitHub Security](https://github.com/toozuuu/ngxsmk-datepicker/security)
- **NPM Security**: [NPM Security](https://www.npmjs.com/package/ngxsmk-datepicker)
- **Email Notifications**: For critical vulnerabilities
- **Release Notes**: Detailed security updates

## 🔐 Security Contact

**Primary Security Contact**: Sachin Dilshan
- **Email**: [sachindilshan040@gmail.com](mailto:sachindilshan040@gmail.com)
- **GitHub**: [@toozuuu](https://github.com/toozuuu)
- **Response Time**: 24-48 hours for critical issues

## 📚 Security Resources

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Angular Security Guide](https://angular.io/guide/security)
- [NPM Security Best Practices](https://docs.npmjs.com/security-best-practices)

### Tools

- [Snyk](https://snyk.io/) - Vulnerability scanning
- [OWASP ZAP](https://owasp.org/www-project-zap/) - Security testing
- [ESLint Security](https://github.com/eslint-community/eslint-plugin-security) - Code security

## 🏆 Security Recognition

We appreciate security researchers who help improve the security of `ngxsmk-datepicker`. Responsible disclosure helps us maintain a secure library for all users.

### Hall of Fame

- Security researchers who responsibly disclose vulnerabilities
- Contributors who improve security features
- Community members who report security issues

## 📄 Legal

This security policy is part of our commitment to maintaining a secure and trustworthy library. By using `ngxsmk-datepicker`, you agree to follow responsible disclosure practices and report security vulnerabilities through the proper channels.

---

**Last Updated**: 2025-01-18  
**Next Review**: 2025-04-18
