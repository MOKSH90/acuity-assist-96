import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Eye, Calendar, Users, Activity, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock patient data
const mockPatients = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 45,
    gender: 'Female',
    mrn: 'MRN001234',
    status: 'Discharged',
    severity: 'Critical',
    score: 95,
    admissionDate: '2024-01-20',
    dischargeDate: '2024-01-20',
    chiefComplaint: 'Chest pain, shortness of breath',
    diagnosis: 'Acute myocardial infarction',
    assignedDoctor: 'Dr. Smith',
    vitals: { bp: '180/110', hr: 125, temp: 99.8, o2: 92 }
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 52,
    gender: 'Male',
    mrn: 'MRN001235',
    status: 'Admitted',
    severity: 'Urgent',
    score: 75,
    admissionDate: '2024-01-20',
    chiefComplaint: 'Severe abdominal pain',
    diagnosis: 'Acute appendicitis',
    assignedDoctor: 'Dr. Johnson',
    vitals: { bp: '160/95', hr: 88, temp: 101.2, o2: 96 }
  },
  {
    id: '3',
    name: 'Emma Wilson',
    age: 28,
    gender: 'Female',
    mrn: 'MRN001236',
    status: 'In Treatment',
    severity: 'Critical',
    score: 88,
    admissionDate: '2024-01-20',
    chiefComplaint: 'Head trauma, unconscious',
    diagnosis: 'Traumatic brain injury',
    assignedDoctor: 'Dr. Brown',
    vitals: { bp: '140/85', hr: 95, temp: 98.1, o2: 94 }
  },
  {
    id: '4',
    name: 'David Rodriguez',
    age: 29,
    gender: 'Male',
    mrn: 'MRN001237',
    status: 'Discharged',
    severity: 'Non-Urgent',
    score: 35,
    admissionDate: '2024-01-19',
    dischargeDate: '2024-01-19',
    chiefComplaint: 'Minor cut, fever',
    diagnosis: 'Laceration with minor infection',
    assignedDoctor: 'Dr. Davis',
    vitals: { bp: '120/75', hr: 75, temp: 100.1, o2: 98 }
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    age: 34,
    gender: 'Female',
    mrn: 'MRN001238',
    status: 'Waiting',
    severity: 'Urgent',
    score: 68,
    admissionDate: '2024-01-20',
    chiefComplaint: 'Difficulty breathing',
    diagnosis: 'Pending evaluation',
    assignedDoctor: 'Dr. Wilson',
    vitals: { bp: '145/90', hr: 102, temp: 99.5, o2: 93 }
  }
];

const AllPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [sortBy, setSortBy] = useState("admission");

  const filteredPatients = patients
    .filter(patient => {
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || patient.status === filterStatus;
      const matchesSeverity = filterSeverity === "all" || patient.severity === filterSeverity;
      
      return matchesSearch && matchesStatus && matchesSeverity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'score': return b.score - a.score;
        case 'admission': return new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime();
        case 'age': return b.age - a.age;
        default: return 0;
      }
    });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Admitted': return 'default';
      case 'In Treatment': return 'secondary';
      case 'Waiting': return 'outline';
      case 'Discharged': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'destructive';
      case 'Urgent': return 'secondary';
      case 'Non-Urgent': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-critical';
      case 'Urgent': return 'text-urgent';
      case 'Non-Urgent': return 'text-non-urgent';
      default: return 'text-muted-foreground';
    }
  };

  const patientStats = {
    total: patients.length,
    admitted: patients.filter(p => p.status === 'Admitted').length,
    inTreatment: patients.filter(p => p.status === 'In Treatment').length,
    waiting: patients.filter(p => p.status === 'Waiting').length,
    discharged: patients.filter(p => p.status === 'Discharged').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Patients</h1>
          <p className="text-muted-foreground mt-1">Complete patient records and history</p>
        </div>
        <Button onClick={() => navigate('/patients/new')}>
          Add New Patient
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold text-foreground">{patientStats.total}</p>
              </div>
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admitted</p>
                <p className="text-2xl font-bold text-foreground">{patientStats.admitted}</p>
              </div>
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Treatment</p>
                <p className="text-2xl font-bold text-urgent">{patientStats.inTreatment}</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-urgent" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Waiting</p>
                <p className="text-2xl font-bold text-critical">{patientStats.waiting}</p>
              </div>
              <Calendar className="h-5 w-5 text-critical" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Discharged</p>
                <p className="text-2xl font-bold text-foreground">{patientStats.discharged}</p>
              </div>
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, MRN, complaint, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Waiting">Waiting</SelectItem>
                    <SelectItem value="In Treatment">In Treatment</SelectItem>
                    <SelectItem value="Admitted">Admitted</SelectItem>
                    <SelectItem value="Discharged">Discharged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Non-Urgent">Non-Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admission">Sort by Admission</SelectItem>
                  <SelectItem value="score">Sort by Score</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="age">Sort by Age</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Patient Records ({filteredPatients.length})</CardTitle>
          <CardDescription>Complete patient database with history and current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/30 transition-smooth cursor-pointer">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="font-semibold text-foreground">{patient.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {patient.age}y, {patient.gender}
                      </span>
                      <Badge variant={getStatusVariant(patient.status)}>
                        {patient.status}
                      </Badge>
                      <Badge variant={getSeverityVariant(patient.severity)}>
                        {patient.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">MRN: {patient.mrn}</span>
                        <span>Admitted: {new Date(patient.admissionDate).toLocaleDateString()}</span>
                        {patient.dischargeDate && (
                          <span>Discharged: {new Date(patient.dischargeDate).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div>
                        <span className="font-medium">Chief Complaint:</span> {patient.chiefComplaint}
                      </div>
                      <div>
                        <span className="font-medium">Diagnosis:</span> {patient.diagnosis}
                      </div>
                      <div className="flex items-center space-x-4 text-xs">
                        <span>Dr: {patient.assignedDoctor}</span>
                        <span>BP: {patient.vitals.bp}</span>
                        <span>HR: {patient.vitals.hr}</span>
                        <span>Temp: {patient.vitals.temp}°F</span>
                        <span>O2: {patient.vitals.o2}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getSeverityColor(patient.severity)}`}>
                      {patient.score}
                    </div>
                    <div className="text-xs text-muted-foreground">Severity Score</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/patients/${patient.id}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
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

export default AllPatients;