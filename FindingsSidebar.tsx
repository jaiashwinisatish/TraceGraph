import React from 'react';
import { Eye, AlertCircle, ExternalLink, Clock, Globe, TrendingUp } from 'lucide-react';

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

interface Metadata {
  total_findings: number;
  investigation_time: number;
  sources_checked: string[];
  risk_levels: {
    high: number;
    medium: number;
    low: number;
  };
}

interface FindingsSidebarProps {
  selectedNode: Node | null;
  nodes: Node[];
  links: Link[];
  metadata: Metadata | null;
  onClearSelection: () => void;
}

const FindingsSidebar: React.FC<FindingsSidebarProps> = ({ 
  selectedNode, 
  nodes, 
  links, 
  metadata, 
  onClearSelection 
}) => {
  const getIconForType = (type: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      email: '📧',
      phone: '📱',
      social_media: '👤',
      version_control: '🔧',
      breach: '🛡️',
      location_info: '📍',
      carrier_info: '📡',
      domain_info: '🌐',
      public_listing: '📋'
    };
    return iconMap[type] || '📄';
  };

  const getSeverityColor = (group: string) => {
    switch (group) {
      case 'high': return 'border-red-500 bg-red-50 text-red-900';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-900';
      case 'low': return 'border-green-500 bg-green-50 text-green-900';
      case 'input': return 'border-blue-500 bg-blue-50 text-blue-900';
      default: return 'border-gray-300 bg-gray-50 text-gray-900';
    }
  };

  if (selectedNode) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Data Point Details</h3>
          <button
            onClick={onClearSelection}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <AlertCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
              {getIconForType(selectedNode.type)}
            </div>
            <div>
              <div className="font-medium text-slate-900">{selectedNode.value}</div>
              <div className="text-sm text-slate-600 capitalize">{selectedNode.type.replace('_', ' ')}</div>
            </div>
          </div>
          
          <div className="border-t pt-4 space-y-3">
            {selectedNode.source && (
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Source</div>
                <div className="text-sm text-slate-900 mt-1">{selectedNode.source}</div>
              </div>
            )}
            
            {selectedNode.description && (
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Description</div>
                <div className="text-sm text-slate-900 mt-1">{selectedNode.description}</div>
              </div>
            )}
            
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Timestamp</div>
              <div className="text-sm text-slate-900 mt-1">
                {new Date().toLocaleString()}
              </div>
            </div>
            
            {selectedNode.confidence && (
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
            )}
            
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Risk Level</div>
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 capitalize ${getSeverityColor(selectedNode.group)}`}>
                {selectedNode.group === 'input' ? 'Source Data' : selectedNode.group}
              </div>
            </div>
          </div>
          
          {/* Related Connections */}
          <div className="border-t pt-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              Related Connections
            </div>
            <div className="space-y-2">
              {links
                .filter(conn => conn.source === selectedNode.id || conn.target === selectedNode.id)
                .map((conn, idx) => {
                  const relatedId = conn.source === selectedNode.id ? conn.target : conn.source;
                  const relatedNode = nodes.find(r => r.id === relatedId);
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
    );
  }

  if (metadata && nodes.length > 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Investigation Summary
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-900">{metadata.total_findings}</div>
              <div className="text-xs text-blue-700">Data Points</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-900">{links.length}</div>
              <div className="text-xs text-green-700">Connections</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-slate-700 mb-2">Risk Distribution</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-red-600">High Risk</span>
                <span className="text-xs font-medium text-red-900">{metadata.risk_levels.high}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-yellow-600">Medium Risk</span>
                <span className="text-xs font-medium text-yellow-900">{metadata.risk_levels.medium}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-green-600">Low Risk</span>
                <span className="text-xs font-medium text-green-900">{metadata.risk_levels.low}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-slate-700 mb-2">Sources Checked</div>
            <div className="space-y-1">
              {metadata.sources_checked.map((source, index) => (
                <div key={index} className="flex items-center text-xs text-slate-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  {source}
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="text-xs text-slate-500">
              Investigation completed at {new Date(metadata.investigation_time * 1000).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center sticky top-8">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <Eye className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-2">Select a Data Point</h3>
      <p className="text-xs text-slate-600">
        Click on any discovered data point to view detailed information and connections
      </p>
      
      <div className="mt-6 space-y-4 text-sm text-slate-600">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="font-medium text-blue-900 mb-2">About OSINT</h4>
          <p className="text-xs text-blue-800">
            Open Source Intelligence involves collecting and analyzing publicly 
            available information from various sources.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h4 className="font-medium text-amber-900 mb-2">Remember</h4>
          <p className="text-xs text-amber-800">
            Always ensure you have proper authorization and follow ethical 
            guidelines when conducting OSINT research.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FindingsSidebar;