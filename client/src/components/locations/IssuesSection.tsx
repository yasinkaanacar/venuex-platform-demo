import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Issue {
  id: string;
  title: string;
  count: number;
  description: string;
}

const mockIssues: Issue[] = [
  {
    id: "missing-photos",
    title: "Missing photos",
    count: 9,
    description: "Locations missing business photos"
  },
  {
    id: "missing-phone",
    title: "Missing phone",
    count: 4,
    description: "Locations without phone numbers"
  },
  {
    id: "temporarily-closed",
    title: "Temporarily closed",
    count: 2,
    description: "Locations marked as temporarily closed"
  },
  {
    id: "business-information-incomplete",
    title: "Business information incomplete",
    count: 7,
    description: "Missing business details"
  },
  {
    id: "missing-description",
    title: "Missing description",
    count: 25,
    description: "Locations without business descriptions"
  },
  {
    id: "missing-category",
    title: "Missing category",
    count: 18,
    description: "Locations without proper categories"
  },
  {
    id: "missing-attributes-languages",
    title: "Missing attributes & languages",
    count: 5,
    description: "Missing business attributes and languages"
  }
];

interface IssuesSectionProps {
  onTakeAction: (issueId: string) => void;
}

export function IssuesSection({ onTakeAction }: IssuesSectionProps) {
  return (
    <Card className="mx-6 mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affected Stores
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockIssues.map((issue) => (
            <div 
              key={issue.id} 
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {issue.title}
                  </h4>
                </div>
                <div className="text-center min-w-[80px]">
                  <Badge 
                    variant="secondary" 
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                  >
                    {issue.count} Record{issue.count !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
              <div className="ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTakeAction(issue.id)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  data-testid={`take-action-${issue.id}`}
                >
                  Take Action
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}