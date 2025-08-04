"""
FastAPI Backend for OSINT Dashboard
Educational implementation with proper error handling and ethical guidelines
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
import json
import time
from osint_scraper import run_email_investigation, run_phone_investigation

app = FastAPI(
    title="OSINT Intelligence API",
    description="Educational OSINT API for security research and training",
    version="1.0.0"
)

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class TraceRequest(BaseModel):
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None

class TraceResponse(BaseModel):
    nodes: List[Dict]
    links: List[Dict]
    metadata: Dict


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "OSINT Intelligence API",
        "version": "1.0.0",
        "disclaimer": "For educational and authorized security research only",
        "endpoints": {
            "trace": "/api/trace (POST)",
            "health": "/health (GET)"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": time.time()}

@app.post("/api/trace", response_model=TraceResponse)
async def trace_investigation(request: TraceRequest):
    """
    Main OSINT investigation endpoint
    
    Performs investigation on provided email and/or phone number
    Returns structured data for frontend visualization
    """
    if not request.email and not request.phone_number:
        raise HTTPException(
            status_code=400, 
            detail="At least one of email or phone_number must be provided"
        )
    
    try:
        all_findings = []
        
        # Email investigation
        if request.email:
            email_results = run_email_investigation(request.email)
            if "error" not in email_results:
                all_findings.extend(email_results["findings"])
        
        # Phone investigation  
        if request.phone_number:
            phone_results = run_phone_investigation(request.phone_number)
            if "error" not in phone_results:
                all_findings.extend(phone_results["findings"])
        
        # Convert findings to nodes and links for graph visualization
        nodes = []
        links = []
        
        # Add input nodes
        node_id = 0
        email_node_id = None
        phone_node_id = None
        
        if request.email:
            nodes.append({
                "id": str(node_id),
                "type": "email",
                "value": request.email,
                "label": request.email,
                "group": "input",
                "source": "User Input",
                "description": "Primary email address under investigation",
                "confidence": 100
            })
            email_node_id = node_id
            node_id += 1
        
        if request.phone_number:
            nodes.append({
                "id": str(node_id),
                "type": "phone", 
                "value": request.phone_number,
                "label": request.phone_number,
                "group": "input",
                "source": "User Input",
                "description": "Phone number under investigation",
                "confidence": 100
            })
            phone_node_id = node_id
            node_id += 1
        
        # Add finding nodes and create links
        for finding in all_findings:
            finding_node = {
                "id": str(node_id),
                "type": finding["type"],
                "value": finding["value"],
                "label": finding["value"],
                "group": finding.get("risk_level", "info"),
                "source": finding["source"],
                "description": finding["description"],
                "confidence": finding.get("confidence", 50)
            }
            nodes.append(finding_node)
            
            # Create link to appropriate input node
            if email_node_id is not None and finding["type"] in ["breach", "social_media", "version_control", "domain_info"]:
                links.append({
                    "source": str(email_node_id),
                    "target": str(node_id),
                    "relationship": "associated_with",
                    "strength": finding.get("confidence", 50) / 100
                })
            elif phone_node_id is not None and finding["type"] in ["carrier_info", "location_info", "public_listing", "validation_error", "error"]:
                links.append({
                    "source": str(phone_node_id) if phone_node_id is not None else "0",
                    "target": str(node_id), 
                    "relationship": "derived_from",
                    "strength": finding.get("confidence", 50) / 100
                })
            
            node_id += 1
        
        # Calculate risk levels
        risk_levels = {
            "high": len([f for f in all_findings if f.get("risk_level") == "high"]),
            "medium": len([f for f in all_findings if f.get("risk_level") == "medium"]),
            "low": len([f for f in all_findings if f.get("risk_level") == "low"])
        }
        
        # Prepare response
        response_data = TraceResponse(
            nodes=nodes,
            links=links,
            metadata={
                "total_findings": len(all_findings),
                "investigation_time": time.time(),
                "sources_checked": list(set([f["source"] for f in all_findings])),
                "risk_levels": risk_levels
            }
        )
        
        return response_data
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Investigation failed: {str(e)}"
        )

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Simple request logging middleware"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    print(f"{request.method} {request.url} - {response.status_code} - {process_time:.3f}s")
    return response

if __name__ == "__main__":
    import uvicorn
    print("Starting OSINT Intelligence API...")
    print("⚠️  Educational use only - Follow ethical guidelines")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)