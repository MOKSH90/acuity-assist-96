import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Search, 
  Filter, 
  RefreshCw, 
  Heart, 
  AlertTriangle,
  Eye,
  ArrowUpDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock patient queue data
const mockQueue = [
  { 
    id: 1, 
    name: "Sarah Johnson", 
    age: 45, 
    severity: "Critical", 
    score: 95, 
    symptoms: "Chest pain, shortness of breath", 
    waitTime: "2 min",
    arrivalTime: "14:32",
    vitals: { bp: "180/110", hr: 125, temp: 99.8, o2: 92 }
  },
  { 
    id: 3, 
    name: "Emma Wilson", 
    age: 28, 
    severity: "Critical", 
    score: 88, 
    symptoms: "Head trauma, unconscious", 
    waitTime: "12 min",
    arrivalTime: "14:28",
    vitals: { bp: "140/85", hr: 95, temp: 98.1, o2: 94 }
  },
  { 
    id: 2, 
    name: "Michael Chen", 
    age: 52, 
    severity: "Urgent", 
    score: 75, 
    symptoms: "Severe abdominal pain", 
    waitTime: "8 min",
    arrivalTime: "14:30",
    vitals: { bp: "160/95", hr: 88, temp: 101.2, o2: 96 }
  },
  { 
    id: 5, 
    name: "Lisa Thompson", 
    age: 34, 
    severity: "Urgent", 
    score: 68, 
    symptoms: "Difficulty breathing", 
    waitTime: "18 min",
    arrivalTime: "14:20",
    vitals: { bp: "145/90", hr: 102, temp: 99.5, o2: 93 }
  },
  { 
    id: 6, 
    name: "Robert Davis", 
    age: 67, 
    severity: "Urgent", 
    score: 65, 
    symptoms: "Chest discomfort, nausea", 
    waitTime: "22 min",
    arrivalTime: "14:16",
    vitals: { bp: "155/88", hr: 85, temp: 98.6, o2: 95 }
  },
  { 
    id: 4, 
    name: "David Rodriguez", 
    age: 29, 
    severity: "Non-Urgent", 
    score: 35, 
    symptoms: "Minor cut, fever", 
    waitTime: "25 min",
    arrivalTime: "14:13",
    vitals: { bp: "120/75", hr: 75, temp: 100.1, o2: 98 }
  },
  { 
    id: 7, 
    name: "Jennifer Kim", 
    age: 41, 
    severity: "Non-Urgent", 
    score: 28, 
    symptoms: "Migraine, nausea", 
    waitTime: "35 min",
    arrivalTime: "14:03",
    vitals: { bp: "125/80", hr: 70, temp: 98.4, o2: 99 }
  },
  { 
    id: 8, 
    name: "Mark Anderson", 
    age: 25, 
    severity: "Non-Urgent", 
    score: 22, 
    symptoms: "Sprained ankle", 
    waitTime: "42 min",
    arrivalTime: "13:56",
    vitals: { bp: "115/70", hr: 68, temp: 98.2, o2: 99 }
  }
];

const getSeverityVariant = (severity: string) => {
  switch (severity) {
    case "Critical": return "destructive";
    case "Urgent": return "secondary";
    case "Non-Urgent": return "outline";
    default: return "outline";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Critical": return "text-critical";
    case "Urgent": return "text-urgent";
    case "Non-Urgent": return "text-non-urgent";
    default: return "text-muted-foreground";
  }
};

const getSeverityBorder = (severity: string) => {
  switch (severity) {
    case "Critical": return "border-l-critical border-l-4";
    case "Urgent": return "border-l-urgent border-l-4";
    case "Non-Urgent": return "border-l-non-urgent border-l-4";
    default: return "border-l-border border-l-4";
  }
};

const PatientQueue = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [sortBy, setSortBy] = useState("score");

  const filteredQueue = mockQueue
    .filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = filterSeverity === "all" || patient.severity === filterSeverity;
      return matchesSearch && matchesSeverity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score": return b.score - a.score;
        case "wait": return parseInt(a.waitTime) - parseInt(b.waitTime);
        case "arrival": return a.arrivalTime.localeCompare(b.arrivalTime);
        default: return b.score - a.score;
      }
    });

  const queueStats = {
    total: mockQueue.length,
    critical: mockQueue.filter(p => p.severity === "Critical").length,
    urgent: mockQueue.filter(p => p.severity === "Urgent").length,
    nonUrgent: mockQueue.filter(p => p.severity === "Non-Urgent").length,
    avgWait: Math.round(mockQueue.reduce((acc, p) => acc + parseInt(p.waitTime), 0) / mockQueue.length)
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patient Queue</h1>
          <p className="text-muted-foreground mt-1">Real-time triage priority management</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => navigate('/patients/new')}>
            Add Patient
          </Button>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Queue</p>
                <p className="text-2xl font-bold text-foreground">{queueStats.total}</p>
              </div>
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-critical">{queueStats.critical}</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-critical" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold text-urgent">{queueStats.urgent}</p>
              </div>
              <Heart className="h-5 w-5 text-urgent" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Non-Urgent</p>
                <p className="text-2xl font-bold text-non-urgent">{queueStats.nonUrgent}</p>
              </div>
              <Heart className="h-5 w-5 text-non-urgent" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Wait</p>
                <p className="text-2xl font-bold text-foreground">{queueStats.avgWait}m</p>
              </div>
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name or symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="all">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Non-Urgent">Non-Urgent</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="score">Sort by Score</option>
                  <option value="wait">Sort by Wait Time</option>
                  <option value="arrival">Sort by Arrival</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Queue */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Current Queue ({filteredQueue.length} patients)</CardTitle>
          <CardDescription>Patients are automatically sorted by priority score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredQueue.map((patient, index) => (
              <div
                key={patient.id}
                className={`flex items-center justify-between p-4 rounded-lg border hover:bg-accent/30 transition-smooth cursor-pointer ${getSeverityBorder(patient.severity)}`}
                onClick={() => navigate(`/patients/${patient.id}`)}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-muted-foreground w-8">
                    #{index + 1}
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-foreground">{patient.name}</h3>
                      <span className="text-sm text-muted-foreground">Age {patient.age}</span>
                      <Badge variant={getSeverityVariant(patient.severity)}>
                        {patient.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{patient.symptoms}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>BP: {patient.vitals.bp}</span>
                      <span>HR: {patient.vitals.hr}</span>
                      <span>Temp: {patient.vitals.temp}°F</span>
                      <span>O2: {patient.vitals.o2}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getSeverityColor(patient.severity)}`}>
                      {patient.score}
                    </div>
                    <div className="text-xs text-muted-foreground">Severity Score</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{patient.waitTime}</div>
                    <div className="text-xs text-muted-foreground">Waiting</div>
                    <div className="text-xs text-muted-foreground">Since {patient.arrivalTime}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientQueue;