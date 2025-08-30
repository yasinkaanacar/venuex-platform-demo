import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EnrichmentSuggestions from './enrichment-suggestions';

export default function DataQualityEnrichment() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Data Quality Assessment</CardTitle>
          <div className="text-sm text-muted-foreground">
            Overall Score: <span className="text-green-600 font-semibold">97%</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Location Data */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Location Data</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Business Names</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">100%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Addresses</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">98%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Phone Numbers</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">94%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Opening Hours</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">96%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Data */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Inventory Data</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Product Names</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '99%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">99%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Product Images</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">87%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Availability</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">95%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pricing</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Data */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Customer Data</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Customer IDs</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">100%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Store IDs</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">100%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Purchase Values</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-8">96%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Data Enrichment Suggestions */}
        <div className="pt-8 border-t border-border">
          <EnrichmentSuggestions />
        </div>
      </CardContent>
    </Card>
  );
}