import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  History as HistoryIcon,
  Clock,
  FileCode,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TransformationRecord {
  id: string;
  timestamp: Date;
  fileName: string;
  layersUsed: number[];
  status: "success" | "failed" | "partial";
  processingTime: number;
  originalSize: number;
  transformedSize: number;
  improvements: number;
}

export function History() {
  const { user } = useAuth();
  const [transformations, setTransformations] = useState<
    TransformationRecord[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "success" | "failed" | "partial"
  >("all");
  const [loading, setLoading] = useState(true);

  // Load real transformation history
  useEffect(() => {
    // TODO: Replace with real API call to fetch user's transformation history
    // For now, show empty state immediately
    setTransformations([]);
    setLoading(false);
  }, []);

  const filteredTransformations = transformations.filter((transformation) => {
    const matchesSearch = transformation.fileName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || transformation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-zinc-400" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-zinc-400" />;
      case "partial":
        return <AlertCircle className="w-4 h-4 text-zinc-400" />;
      default:
        return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    return "bg-zinc-800/30 text-zinc-400 border-zinc-700/30";
  };

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-8 text-center">
            <p className="text-zinc-400">
              Please sign in to view your transformation history.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">History</h1>
        <p className="text-zinc-400">
          View and manage your past code transformations
        </p>
      </div>

      <div className="space-y-6">
        {/* Filters */}
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    placeholder="Search by filename..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-400"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {(["all", "success", "failed", "partial"] as const).map(
                  (status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className={`capitalize ${
                        statusFilter === status
                          ? "bg-zinc-700 text-white"
                          : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      {status}
                    </Button>
                  ),
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transformations List */}
        <div className="space-y-4">
          {loading ? (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                <p className="text-zinc-400 mt-4">
                  Loading your transformation history...
                </p>
              </CardContent>
            </Card>
          ) : filteredTransformations.length === 0 ? (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-8 text-center">
                <HistoryIcon className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">
                  {searchTerm || statusFilter !== "all"
                    ? "No transformations match your current filters."
                    : "No transformations yet. Start by transforming some code!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTransformations.map((transformation) => (
              <Card
                key={transformation.id}
                className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileCode className="w-5 h-5 text-zinc-400" />
                        <h3 className="text-lg font-semibold text-white">
                          {transformation.fileName}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusColor(transformation.status)}`}
                        >
                          {getStatusIcon(transformation.status)}
                          <span className="ml-1 capitalize">
                            {transformation.status}
                          </span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-zinc-400">Processed</p>
                          <p className="text-white font-medium">
                            {formatDistanceToNow(transformation.timestamp)} ago
                          </p>
                        </div>

                        <div>
                          <p className="text-zinc-400">Layers</p>
                          <p className="text-white font-medium">
                            {transformation.layersUsed.length} applied
                          </p>
                        </div>

                        <div>
                          <p className="text-zinc-400">Processing Time</p>
                          <p className="text-white font-medium">
                            {transformation.processingTime > 0
                              ? `${(transformation.processingTime / 1000).toFixed(1)}s`
                              : "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-zinc-400">Improvements</p>
                          <p className="text-white font-medium">
                            {transformation.improvements} found
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-white"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-white"
                        title="Download results"
                      >
                        <Download className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
