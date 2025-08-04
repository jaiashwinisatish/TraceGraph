# OSINT Intelligence Dashboard

An educational Open Source Intelligence (OSINT) analysis platform for security research and training purposes.

## ⚠️ IMPORTANT DISCLAIMER

**This tool is for educational and authorized security research purposes only.**

### Ethical Guidelines

- ✅ **Legitimate Use Cases:**
  - Security research and vulnerability assessment
  - Digital forensics and incident response
  - Corporate security auditing (with proper authorization)
  - Educational and training purposes

- ❌ **Prohibited Activities:**
  - Stalking, harassment, or invasion of privacy
  - Unauthorized access to systems or accounts
  - Malicious use against individuals without consent
  - Violating terms of service or applicable laws

### Legal Requirements

- Obtain proper authorization before investigating
- Respect privacy rights and data protection laws
- Use information responsibly and securely
- Report findings through appropriate channels

## Features

### Frontend Dashboard
- Interactive intelligence analysis interface
- Real-time investigation progress tracking
- Network graph visualization (simulated)
- Detailed data point analysis
- Ethical guidelines integration

### Backend API
- RESTful API for OSINT operations
- Email investigation capabilities
- Phone number analysis
- Structured data output for visualization
- Comprehensive error handling

### Educational Implementation
- Simulated data sources for demonstration
- Mock API responses for learning
- Ethical guidelines prominently displayed
- Safe environment for OSINT training

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React UI      │    │   FastAPI       │    │   OSINT         │
│   Dashboard     │◄──►│   Backend       │◄──►│   Scraper       │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Getting Started

### Frontend Setup (React/Vite)
```bash
npm install
npm run dev
```

### Backend Setup (Python/FastAPI)
```bash
cd src/backend
pip install -r requirements.txt
python api.py
```

## API Endpoints

### POST /api/trace
Performs OSINT investigation on provided email and/or phone number.

**Request:**
```json
{
  "email": "user@example.com",
  "phone_number": "+1234567890"
}
```

**Response:**
```json
{
  "nodes": [...],
  "links": [...],
  "metadata": {
    "total_findings": 5,
    "investigation_time": 1699123456.789,
    "sources_checked": ["HaveIBeenPwned API", "GitHub", "WHOIS"],
    "risk_levels": {
      "high": 1,
      "medium": 2,
      "low": 2
    }
  }
}
```

## Data Sources (Educational Simulation)

### Email Investigation
- **Breach Databases:** Simulated HaveIBeenPwned integration
- **Social Media:** Public profile discovery simulation
- **Version Control:** GitHub public repository analysis
- **Domain Analysis:** WHOIS database simulation

### Phone Investigation
- **Carrier Information:** Phone number analysis using phonenumbers library
- **Geographic Data:** Location information extraction
- **Public Listings:** Directory search simulation

## Security Considerations

1. **Rate Limiting:** Implement appropriate rate limiting for API calls
2. **Data Privacy:** Never store sensitive investigation data
3. **Access Control:** Implement proper authentication and authorization
4. **Audit Logging:** Log all investigation activities for compliance
5. **Terms Compliance:** Ensure all data sources are accessed within their terms of service

## Development Guidelines

### Adding New Data Sources
1. Create new scraper method in `osint_scraper.py`
2. Update API response format in `api.py`
3. Add visualization support in frontend
4. Include proper error handling and rate limiting

### Ethical Implementation
- Always simulate sensitive operations in educational contexts
- Include consent and authorization checks
- Provide clear usage guidelines
- Implement data retention policies

## Contributing

When contributing to this educational project:

1. Maintain focus on educational and legitimate security research use cases
2. Include ethical guidelines in all new features
3. Use simulated data sources to prevent misuse
4. Document security considerations thoroughly

## License

This educational tool is provided for learning purposes. Users are responsible for ensuring compliance with all applicable laws and regulations.

## Support

For educational inquiries and legitimate security research collaboration, please refer to the documentation and ethical guidelines provided.