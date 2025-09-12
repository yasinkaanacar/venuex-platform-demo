import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GaugeChart = ({ percentage }: { percentage: number }) => {
  const angle = (percentage / 100) * 180 - 90;

  return (
    <div className="relative w-24 h-12 mb-4">
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="w-20 h-10 border-4 border-gray-200 rounded-t-full relative overflow-hidden">
          <div
            className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-blue-500 origin-bottom transform -translate-x-1/2"
            style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
          />
        </div>
      </div>
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center text-green-600 font-semibold">
          <span className="text-sm">+{percentage}%</span>
          <div className="ml-1 w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-green-600" />
        </div>
      </div>
    </div>
  );
};

export function BusinessMetricsSection() {
  return (
    <Card className="w-full shadow-none border-0" style={{ boxShadow: 'none' }}>
      <CardContent className="p-4 shadow-none">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Index Section - 1/3 */}
          <div className="flex flex-col items-center text-center h-full justify-between">
            <div className="flex flex-col items-center">
              <div className="font-bold text-gray-900 mb-4 text-[48px]">
                87%
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Data Quality Index
              </h3>
              <p className="text-sm text-gray-600 text-center leading-relaxed mb-6">
                Tips will appear here on how to improve your online map presence
                and company performance
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full text-blue-600 hover:text-blue-700"
              onClick={() => {
                // Try to find the Data Quality Assessment section
                let element =
                  document.getElementById("data-quality-assessment") ||
                  document.querySelector(
                    '[data-section="data-quality-assessment"]',
                  );

                if (!element) {
                  // Find by heading text content
                  const headings = Array.from(
                    document.querySelectorAll("h1, h2, h3, h4"),
                  );
                  for (const heading of headings) {
                    if (
                      heading.textContent?.includes("Data Quality Assessment")
                    ) {
                      element =
                        heading.closest("div") || (heading as HTMLElement);
                      break;
                    }
                  }
                }

                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              View details
            </Button>
          </div>

          {/* Performance Section - 2/3 */}
          <div className="flex flex-col h-full">
            <div className="flex flex-col flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Performance
              </h3>
              <div className="space-y-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">243</div>
                  <div className="text-sm text-gray-600">
                    Total Interactions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">177</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full text-blue-600 hover:text-blue-700"
              onClick={() => {
                // Try to find the Performance section
                let element =
                  document.getElementById("performance-section") ||
                  document.querySelector(
                    '[data-section="performance-section"]',
                  );

                if (!element) {
                  // Find by heading text content
                  const headings = Array.from(
                    document.querySelectorAll("h1, h2, h3, h4"),
                  );
                  for (const heading of headings) {
                    if (
                      heading.textContent?.includes("Performance") &&
                      !heading.closest(".card")
                    ) {
                      element =
                        heading.closest("div") || (heading as HTMLElement);
                      break;
                    }
                  }
                }

                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              View details
            </Button>
          </div>

          {/* Store Status Section - 3/3 */}
          <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
              Store Status
            </h3>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Total Locations</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">130</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Open</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">124</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Temporarily Closed
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-900">4</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Permanently Closed
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-900">2</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full text-blue-600 hover:text-blue-700 mt-auto"
              onClick={() => {
                // Try to find the Locations section header
                let element =
                  document.getElementById("locations-section") ||
                  document.querySelector('[data-section="locations"]');

                if (!element) {
                  // Find the "Locations" heading specifically (not inside the current card)
                  const headings = Array.from(
                    document.querySelectorAll("h1, h2, h3, h4"),
                  );
                  for (const heading of headings) {
                    if (
                      heading.textContent?.trim() === "Locations" &&
                      !heading.closest('[class*="BusinessMetrics"]')
                    ) {
                      element =
                        heading.closest("div") || (heading as HTMLElement);
                      break;
                    }
                  }
                }

                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              View details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
