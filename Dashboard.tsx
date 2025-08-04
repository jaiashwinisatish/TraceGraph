import React, { useState, useEffect } from 'react';
import { 
  Search, Shield, AlertTriangle, Eye, Phone, Mail, User, Link2, 
  Database, Clock, MapPin, Activity, Globe, Github, AlertCircle,
  ExternalLink, Info, FileText, Users
} from 'lucide-react';

interface DataPoint {
  id: string;
  type: 'email' | 'phone' | 'social' | 'breach' | 'location' | 'profile' | 'domain' | 'metadata';
  value: string;
  source: string;
  timestamp: string;
  description: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  url?: string;
  confidence: number;
}

interface Connection {
  from: string;
  to: string;
  relationship: string;
  strength: number;
}

interface SearchQuery {
  email: string;
  phone: string;
}

const Dashboard: React.FC = () => {
  const [query, setQuery] = useState<SearchQuery>({ email: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DataPoint[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<DataPoint | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showEthicalModal, setShowEthicalModal] = useState(true);

  // Simulated OSINT data for educational purposes
  const generateMockResults = (email: string, phone: string): { results: DataPoint[], connections: Connection[] } => {
    const mockResults: DataPoint[] = [];
    const mockConnections: Connection[] = [];
    let idCounter = 1;

    if (email) {
      // Email-related findings
      const emailNode: DataPoint = {
        id: `${idCounter++}`,
        type: 'email',
        value: email,
        source: 'Input',
        timestamp: new Date().toISOString(),
        description: 'Primary email address under investigation',
        confidence: 100
      };
      mockResults.push(emailNode);

      // Simulated breach data
      const breachNode: DataPoint = {
        id: `${idCounter++}`,
        type: 'breach',
        value: 'Collection #1 (2019)',
        source: 'HaveIBeenPwned API',
        timestamp: '2019-01-07T00:00:00Z',
        description: 'Email found in major data breach compilation',
        severity: 'high',
        url: 'https://haveibeenpwned.com/',
        confidence: 95
      };
      mockResults.push(breachNode);
      mockConnections.push({
        from: emailNode.id,
        to: breachNode.id,
        relationship: 'compromised_in',
        strength: 0.9
      });

      // Simulated social media presence
      const socialNode: DataPoint = {
        id: `${idCounter++}`,
        type: 'social',
        value: '@user_handle',
        source: 'GitHub Public API',
        timestamp: new Date().toISOString(),
        description: 'Associated GitHub profile with public repositories',
        severity: 'low',
        url: 'https://github.com/',
        confidence: 80
      };
      mockResults.push(socialNode);
      mockConnections.push({
        from: emailNode.id,
        to: socialNode.id,
        relationship: 'associated_with',
        strength: 0.7
      });

      // Domain analysis
      const domain = email.split('@')[1];
      const domainNode: DataPoint = {
        id: `${idCounter++}`,
        type: 'domain',
        value: domain,
        source: 'WHOIS Lookup',
        timestamp: new Date().toISOString(),
        description: `Domain registration and DNS information for ${domain}`,
        severity: 'medium',
        confidence: 90
      };
      mockResults.push(domainNode);
      mockConnections.push({
        from: emailNode.id,
        to: domainNode.id,
        relationship: 'belongs_to_domain',
        strength: 1.0
      });
    }

    if (phone) {
      // Phone-related findings
      const phoneNode: DataPoint = {
        id: `${idCounter++}`,
        type: 'phone',
        value: phone,
        source: 'Input',
        timestamp: new Date().toISOString(),
        description: 'Phone number under investigation',
        confidence: 100
      };
      mockResults.push(phoneNode);

      // Location data
      const locationNode: DataPoint = {
        id: `${idCounter++}`,
        type: 'location',
        value: 'United States - California',
        source: 'Carrier Database Lookup',
        timestamp: new Date().toISOString(),
        description: 'Geographic region based on area code analysis',
        severity: 'medium',
        confidence: 85
      };
      mockResults.push(locationNode);
      mockConnections.push({
        from: phoneNode.id,
        to: locationNode.id,
        relationship: 'registered_in',
        strength: 0.8
      });

      // Carrier information
      const carrierNode: DataPoint = {
        id: `${idCounter++}`,
        type: 'metadata',
        value: 'Verizon Wireless',
        source: 'Phone Number Analysis',
        timestamp: new Date().toISOString(),
        description: 'Mobile carrier identification',
        severity: 'low',
        confidence: 92
      };
      mockResults.push(carrierNode);
      mockConnections.push({
        from: phoneNode.id,
        to: carrierNode.id,
        relationship: 'served_by',
        strength: 0.9
      });
    }

    return { results: mockResults, connections: mockConnections };
  };

  const handleSearch = async () => {
    if (!query.email && !query.phone) return;
    
    setIsLoading(true);
    setShowResults(false);
    setSelectedNode(null);
    
    // Simulate API call delay
    setTimeout(() => {
      const { results, connections } = generateMockResults(query.email, query.phone);
      setResults(results);
      setConnections(connections);
      setIsLoading(false);
      setShowResults(true);
    }, 3000);
  };

  const getIconForType = (type: DataPoint['type']) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'social': return <User className="w-4 h-4" />;
      case 'breach': return <Shield className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'profile': return <Eye className="w-4 h-4" />;
      case 'domain': return <Globe className="w-4 h-4" />;
      case 'metadata': return <Info className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'border-purple-500 bg-purple-50 text-purple-900';
      case 'high': return 'border-red-500 bg-red-50 text-red-900';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-900';
      case 'low': return 'border-green-500 bg-green-50 text-green-900';
      default: return 'border-gray-300 bg-gray-50 text-gray-900';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Ethical Guidelines Modal */}
      {showEthicalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-start space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ethical OSINT Guidelines</h2>
                <p className="text-gray-600 mt-1">Please read and acknowledge these important guidelines</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm text-gray-700">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-800 mb-2">🎯 Legitimate Use Cases</h3>
                <ul className="list-disc list-inside space-y-1 text-amber-700">
                  <li>Security research and vulnerability assessment</li>
                  <li>Digital forensics and incident response</li>
                  <li>Corporate security auditing (with authorization)</li>
                  <li>Educational and training purposes</li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">🚫 Prohibited Activities</h3>
                <ul className="list-disc list-inside space-y-1 text-red-700">
                  <li>Stalking, harassment, or invasion of privacy</li>
                  <li>Unauthorized access to systems or accounts</li>
                  <li>Malicious use against individuals without consent</li>
                  <li>Violating terms of service or applicable laws</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">⚖️ Legal & Ethical Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Obtain proper authorization before investigating</li>
                  <li>Respect privacy rights and data protection laws</li>
                  <li>Use information responsibly and securely</li>
                  <li>Report findings through appropriate channels</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                This tool is for educational demonstration purposes only
              </p>
              <button
                onClick={() => setShowEthicalModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">OSINT Intelligence Dashboard</h1>
                <p className="text-sm text-slate-400">Open Source Intelligence Analysis Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Educational Demo</span>
              </div>
              <button
                onClick={() => setShowEthicalModal(true)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Investigation Query
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={query.email}
                    onChange={(e) => setQuery({ ...query, email: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={query.phone}
                    onChange={(e) => setQuery({ ...query, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={handleSearch}
                  disabled={isLoading || (!query.email && !query.phone)}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Analyzing Sources...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Start Investigation
                    </>
                  )}
                </button>
              </div>

              {/* Loading Progress */}
              {isLoading && (
                <div className="mt-6 space-y-3">
                  <div className="text-sm text-slate-600">Checking sources...</div>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-slate-500">
                      <div className="animate-pulse bg-blue-200 rounded w-2 h-2 mr-2"></div>
                      HaveIBeenPwned API
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <div className="animate-pulse bg-blue-200 rounded w-2 h-2 mr-2"></div>
                      GitHub Public Profiles
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <div className="animate-pulse bg-blue-200 rounded w-2 h-2 mr-2"></div>
                      WHOIS Database
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <div className="animate-pulse bg-blue-200 rounded w-2 h-2 mr-2"></div>
                      Phone Carrier Lookup
                    </div>
                  </div>
                </div>
              )}

              {/* Results Summary */}
              {showResults && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Discovery Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Data Points Found:</span>
                      <span className="font-medium text-slate-900">{results.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Connections:</span>
                      <span className="font-medium text-slate-900">{connections.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">High Risk Items:</span>
                      <span className="font-medium text-red-600">
                        {results.filter(r => r.severity === 'high' || r.severity === 'critical').length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {!showResults && !isLoading && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready for Investigation</h3>
                <p className="text-slate-600 mb-6">
                  Enter an email address or phone number to begin OSINT analysis
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <Mail className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <div className="font-medium">Email Analysis</div>
                    <div>Breach checks, social media, domain info</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <Phone className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <div className="font-medium">Phone Analysis</div>
                    <div>Carrier info, location, public listings</div>
                  </div>
                </div>
              </div>
            )}

            {showResults && (
              <div className="space-y-6">
                {/* Network Visualization Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Intelligence Network Graph
                  </h3>
                  <div className="bg-slate-50 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Link2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-sm text-slate-600">
                        Interactive network graph visualization
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Shows relationships between discovered data points
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Points List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Discovered Data Points
                  </h3>
                  <div className="space-y-3">
                    {results.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedNode(item)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedNode?.id === item.id ? 'ring-2 ring-blue-500' : ''
                        } ${getSeverityColor(item.severity)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="mt-1">
                              {getIconForType(item.type)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{item.value}</div>
                              <div className="text-xs opacity-75 mt-1">{item.description}</div>
                              <div className="flex items-center space-x-3 mt-2 text-xs">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(item.timestamp).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <Globe className="w-3 h-3 mr-1" />
                                  {item.source}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                              {item.confidence}% confidence
                            </span>
                            {item.url && (
                              <ExternalLink className="w-4 h-4 opacity-60" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            {selectedNode ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Data Point Details</h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <AlertCircle className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getIconForType(selectedNode.type)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{selectedNode.value}</div>
                      <div className="text-sm text-slate-600 capitalize">{selectedNode.type}</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-3">
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Source</div>
                      <div className="text-sm text-slate-900 mt-1">{selectedNode.source}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Description</div>
                      <div className="text-sm text-slate-900 mt-1">{selectedNode.description}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Timestamp</div>
                      <div className="text-sm text-slate-900 mt-1">
                        {new Date(selectedNode.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Confidence</div>
                      <div className="flex items-center mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${selectedNode.confidence}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-slate-700">
                          {selectedNode.confidence}%
                        </span>
                      </div>
                    </div>
                    
                    {selectedNode.severity && (
                      <div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Risk Level</div>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 capitalize ${getSeverityColor(selectedNode.severity)}`}>
                          {selectedNode.severity}
                        </div>
                      </div>
                    )}
                    
                    {selectedNode.url && (
                      <div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Source URL</div>
                        <a 
                          href={selectedNode.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 mt-1 flex items-center"
                        >
                          View Source
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {/* Related Connections */}
                  <div className="border-t pt-4">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                      Related Connections
                    </div>
                    <div className="space-y-2">
                      {connections
                        .filter(conn => conn.from === selectedNode.id || conn.to === selectedNode.id)
                        .map((conn, idx) => {
                          const relatedId = conn.from === selectedNode.id ? conn.to : conn.from;
                          const relatedNode = results.find(r => r.id === relatedId);
                          return (
                            <div key={idx} className="flex items-center space-x-2 text-xs">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-slate-600">
                                {conn.relationship} {relatedNode?.value}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            ) : showResults ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Select a Data Point</h3>
                <p className="text-xs text-slate-600">
                  Click on any discovered data point to view detailed information
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">About OSINT</h3>
                <div className="space-y-4 text-sm text-slate-600">
                  <p>
                    Open Source Intelligence (OSINT) involves collecting and analyzing publicly 
                    available information from various sources.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="font-medium text-blue-900 mb-2">Sources Include:</h4>
                    <ul className="space-y-1 text-blue-800 text-xs">
                      <li>• Public databases and APIs</li>
                      <li>• Social media platforms</li>
                      <li>• Domain registration records</li>
                      <li>• Data breach notifications</li>
                      <li>• Phone carrier databases</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <h4 className="font-medium text-amber-900 mb-2">Remember:</h4>
                    <p className="text-amber-800 text-xs">
                      Always ensure you have proper authorization and follow ethical 
                      guidelines when conducting OSINT research.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;