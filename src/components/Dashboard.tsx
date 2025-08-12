import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Clock, 
  Bed, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Heart,
  UserPlus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const mockPatients = [
  { id: 1, name: "Sarah Johnson", severity: "Critical", score: 95, symptoms: "Chest pain, shortness of breath", time: "2 min ago" },
  { id: 2, name: "Michael Chen", severity: "Urgent", score: 75, symptoms: "Severe abdominal pain", time: "8 min ago" },
  { id: 3, name: "Emma Wilson", severity: "Critical", score: 88, symptoms: "Head trauma, unconscious", time: "12 min ago" },
  { id: 4, name: "David Rodriguez", severity: "Non-Urgent", score: 35, symptoms: "Minor cut, fever", time: "25 min ago" },
  { id: 5, name: "Lisa Thompson", severity: "Urgent", score: 68, symptoms: "Difficulty breathing", time: "18 min ago" }
];

const stats = [
  { title: "Patients in Queue", value: "12", trend: "+3", icon: Users, color: "text-primary" },
  { title: "Avg Wait Time", value: "8m", trend: "-2m", icon: Clock, color: "text-urgent" },
  { title: "Available Beds", value: "6/24", trend: "-2", icon: Bed, color: "text-non-urgent" },
  { title: "Critical Cases", value: "3", trend: "+1", icon: AlertTriangle, color: "text-critical" }
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

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emergency Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor patient flow and triage status</p>
        </div>
        <Button 
          onClick={() => navigate('/patients/new')}
          className="bg-gradient-primary hover:opacity-90 transition-smooth"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-card border border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                    <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-critical' : 'text-non-urgent'}`}>
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-accent/20`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Queue */}
        <Card className="lg:col-span-2 shadow-card border border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>Priority Queue</span>
              </CardTitle>
              <CardDescription>Patients sorted by severity score</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/patients/queue')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPatients.slice(0, 4).map((patient) => (
                <div 
                  key={patient.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/30 transition-smooth cursor-pointer"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">{patient.symptoms}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`font-semibold ${getSeverityColor(patient.severity)}`}>
                        Score: {patient.score}
                      </div>
                      <div className="text-xs text-muted-foreground">{patient.time}</div>
                    </div>
                    <Badge variant={getSeverityVariant(patient.severity)}>
                      {patient.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bed Status */}
        <Card className="shadow-card border border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bed className="h-5 w-5 text-primary" />
              <span>Bed Occupancy</span>
            </CardTitle>
            <CardDescription>Current department status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ICU</span>
                  <span className="font-medium">8/10</span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div className="bg-gradient-critical h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Emergency</span>
                  <span className="font-medium">12/18</span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div className="bg-gradient-urgent h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">General</span>
                  <span className="font-medium">45/60</span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div className="bg-gradient-safe h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/beds')}
              >
                Manage Beds
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Latest system events and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-critical rounded-full"></div>
              <span className="text-muted-foreground">14:32</span>
              <span className="text-foreground">Critical patient admitted - Sarah Johnson</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-urgent rounded-full"></div>
              <span className="text-muted-foreground">14:28</span>
              <span className="text-foreground">Patient transferred to ICU - Emma Wilson</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-non-urgent rounded-full"></div>
              <span className="text-muted-foreground">14:15</span>
              <span className="text-foreground">Bed 12-A now available in Emergency</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">14:08</span>
              <span className="text-foreground">Triage model accuracy updated - 99.2%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}