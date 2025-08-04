import React from 'react';
import { Activity, Link2, Mail, Phone, User, Shield, MapPin, Globe, Info } from 'lucide-react';

interface Node {
  id: string;
  type: string;
  value: string;
  label: string;
  group: string;
  source?: string;
  description?: string;
  confidence?: number;
}

interface Link {
  source: string;
  target: string;
  relationship: string;
  strength: number;
}

interface GraphViewProps {
  nodes: Node[];
  links: Link[];
  onNodeClick: (node: Node) => void;
  selectedNodeId?: string;
}

const GraphView: React.FC<GraphViewProps> = ({ nodes, links, onNodeClick, selectedNodeId }) => {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'social_media':
      case 'version_control': return <User className="w-4 h-4" />;
      case 'breach': return <Shield className="w-4 h-4" />;
      case 'location_info':
      case 'carrier_info': return <MapPin className="w-4 h-4" />;
      case 'domain_info': return <Globe className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getNodeColor = (group: string) => {
    switch (group) {
      case 'input': return 'bg-blue-100 border-blue-500 text-blue-900';
      case 'high': return 'bg-red-100 border-red-500 text-red-900';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      case 'low': return 'bg-green-100 border-green-500 text-green-900';
      case 'info': return 'bg-gray-100 border-gray-500 text-gray-900';
      default: return 'bg-slate-100 border-slate-500 text-slate-900';
    }
  };

  if (nodes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-slate-400" />
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Network Visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Intelligence Network Graph
        </h3>
        
        {/* Simplified Graph Visualization */}
        <div className="bg-slate-50 rounded-lg p-6 min-h-64">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {nodes.map((node, index) => (
              <div key={node.id} className="relative">
                <button
                  onClick={() => onNodeClick(node)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md
                    ${selectedNodeId === node.id ? 'ring-2 ring-blue-500' : ''}
                    ${getNodeColor(node.group)}
                  `}
                >
                  <div className="flex items-center space-x-2">
                    {getIconForType(node.type)}
                    <span className="text-sm font-medium truncate max-w-32">
                      {node.label}
                    </span>
                  </div>
                </button>
                
                {/* Connection Lines (simplified) */}
                {links
                  .filter(link => link.source === node.id)
                  .map((link, linkIndex) => (
                    <div
                      key={linkIndex}
                      className="absolute top-1/2 left-full w-8 h-0.5 bg-slate-300 transform -translate-y-1/2"
                      style={{ zIndex: -1 }}
                    />
                  ))}
              </div>
            ))}
          </div>
          
          {/* Connection Legend */}
          <div className="mt-6 text-center">
            <div className="text-sm text-slate-600 mb-2">Network Connections</div>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
              {links.map((link, index) => (
                <span key={index} className="bg-white px-2 py-1 rounded border">
                  {link.relationship}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data Points List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Link2 className="w-5 h-5 mr-2" />
          Discovered Data Points
        </h3>
        <div className="space-y-3">
          {nodes.map((node) => (
            <button
              key={node.id}
              onClick={() => onNodeClick(node)}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md
                ${selectedNodeId === node.id ? 'ring-2 ring-blue-500' : ''}
                ${getNodeColor(node.group)}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getIconForType(node.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{node.value}</div>
                    <div className="text-xs opacity-75 mt-1">{node.description}</div>
                    {node.source && (
                      <div className="flex items-center space-x-3 mt-2 text-xs">
                        <span className="flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          {node.source}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {node.confidence && (
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      node.confidence >= 90 ? 'text-green-600 bg-green-100' :
                      node.confidence >= 70 ? 'text-yellow-600 bg-yellow-100' :
                      'text-red-600 bg-red-100'
                    }`}>
                      {node.confidence}% confidence
                    </span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphView;