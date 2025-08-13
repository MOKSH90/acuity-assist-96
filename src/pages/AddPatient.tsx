import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Heart, AlertTriangle, Activity, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

// Symptom scoring system
const symptoms = [
  { id: "chest_pain", name: "Chest Pain", score: 25, critical: true },
  { id: "shortness_breath", name: "Shortness of Breath", score: 20, critical: true },
  { id: "unconscious", name: "Loss of Consciousness", score: 30, critical: true },
  { id: "severe_bleeding", name: "Severe Bleeding", score: 25, critical: true },
  { id: "head_trauma", name: "Head Trauma", score: 22, critical: true },
  { id: "abdominal_pain", name: "Severe Abdominal Pain", score: 15, critical: false },
  { id: "difficulty_breathing", name: "Difficulty Breathing", score: 18, critical: false },
  { id: "high_fever", name: "High Fever (>103°F)", score: 12, critical: false },
  { id: "vomiting", name: "Persistent Vomiting", score: 8, critical: false },
  { id: "dizziness", name: "Severe Dizziness", score: 10, critical: false },
  { id: "allergic_reaction", name: "Allergic Reaction", score: 16, critical: false },
  { id: "broken_bone", name: "Suspected Fracture", score: 12, critical: false },
  { id: "minor_cut", name: "Minor Cut/Laceration", score: 3, critical: false },
  { id: "mild_fever", name: "Mild Fever", score: 5, critical: false },
  { id: "headache", name: "Headache", score: 4, critical: false },
  { id: "nausea", name: "Nausea", score: 3, critical: false }
];

const AddPatient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    emergencyContact: "",
    chiefComplaint: "",
    selectedSymptoms: [] as string[],
    vitals: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      painLevel: ""
    }
  });

  const calculateSeverityScore = () => {
    const symptomScore = patientData.selectedSymptoms.reduce((total, symptomId) => {
      const symptom = symptoms.find(s => s.id === symptomId);
      return total + (symptom?.score || 0);
    }, 0);

    // Add vital signs scoring
    let vitalScore = 0;
    const { vitals } = patientData;
    
    // Heart rate scoring
    const hr = parseInt(vitals.heartRate);
    if (hr > 120 || hr < 50) vitalScore += 10;
    else if (hr > 100 || hr < 60) vitalScore += 5;

    // Temperature scoring
    const temp = parseFloat(vitals.temperature);
    if (temp > 103 || temp < 95) vitalScore += 8;
    else if (temp > 101 || temp < 97) vitalScore += 4;

    // Oxygen saturation scoring
    const o2 = parseInt(vitals.oxygenSaturation);
    if (o2 < 90) vitalScore += 15;
    else if (o2 < 95) vitalScore += 8;

    // Pain level scoring
    const pain = parseInt(vitals.painLevel);
    if (pain >= 8) vitalScore += 12;
    else if (pain >= 6) vitalScore += 6;
    else if (pain >= 4) vitalScore += 3;

    return symptomScore + vitalScore;
  };

  const getSeverityCategory = (score: number) => {
    if (score >= 60) return { category: "Critical", color: "critical", priority: 1 };
    if (score >= 30) return { category: "Urgent", color: "urgent", priority: 2 };
    return { category: "Non-Urgent", color: "non-urgent", priority: 3 };
  };

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    setPatientData(prev => ({
      ...prev,
      selectedSymptoms: checked 
        ? [...prev.selectedSymptoms, symptomId]
        : prev.selectedSymptoms.filter(id => id !== symptomId)
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendResponse, setBackendResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit to backend API
      const response = await apiService.submitPatient(patientData);
      setBackendResponse(response);
      
      toast({
        title: "Patient Submitted Successfully",
        description: `${patientData.firstName} ${patientData.lastName} has been processed. Backend severity score: ${response.severityScore}`,
      });
      
      // Navigate after 3 seconds to show the response
      setTimeout(() => {
        navigate('/patients');
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit patient data to backend. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const severityScore = calculateSeverityScore();
  const severity = getSeverityCategory(severityScore);
  const hasCriticalSymptoms = patientData.selectedSymptoms.some(id => 
    symptoms.find(s => s.id === id)?.critical
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Patient</h1>
          <p className="text-muted-foreground">Complete triage assessment and symptom scoring</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Patient Information</span>
                </CardTitle>
                <CardDescription>Basic patient details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={patientData.firstName}
                      onChange={(e) => setPatientData(prev => ({...prev, firstName: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={patientData.lastName}
                      onChange={(e) => setPatientData(prev => ({...prev, lastName: e.target.value}))}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={patientData.age}
                      onChange={(e) => setPatientData(prev => ({...prev, age: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      value={patientData.gender}
                      onChange={(e) => setPatientData(prev => ({...prev, gender: e.target.value}))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={patientData.phone}
                      onChange={(e) => setPatientData(prev => ({...prev, phone: e.target.value}))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Name and phone number"
                    value={patientData.emergencyContact}
                    onChange={(e) => setPatientData(prev => ({...prev, emergencyContact: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                  <Textarea
                    id="chiefComplaint"
                    placeholder="Primary reason for visit..."
                    value={patientData.chiefComplaint}
                    onChange={(e) => setPatientData(prev => ({...prev, chiefComplaint: e.target.value}))}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Vital Signs</span>
                </CardTitle>
                <CardDescription>Current vital sign measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure</Label>
                    <Input
                      id="bloodPressure"
                      placeholder="120/80"
                      value={patientData.vitals.bloodPressure}
                      onChange={(e) => setPatientData(prev => ({
                        ...prev,
                        vitals: {...prev.vitals, bloodPressure: e.target.value}
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      placeholder="72"
                      value={patientData.vitals.heartRate}
                      onChange={(e) => setPatientData(prev => ({
                        ...prev,
                        vitals: {...prev.vitals, heartRate: e.target.value}
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°F)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder="98.6"
                      value={patientData.vitals.temperature}
                      onChange={(e) => setPatientData(prev => ({
                        ...prev,
                        vitals: {...prev.vitals, temperature: e.target.value}
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                    <Input
                      id="respiratoryRate"
                      type="number"
                      placeholder="16"
                      value={patientData.vitals.respiratoryRate}
                      onChange={(e) => setPatientData(prev => ({
                        ...prev,
                        vitals: {...prev.vitals, respiratoryRate: e.target.value}
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oxygenSaturation">O2 Saturation (%)</Label>
                    <Input
                      id="oxygenSaturation"
                      type="number"
                      placeholder="98"
                      value={patientData.vitals.oxygenSaturation}
                      onChange={(e) => setPatientData(prev => ({
                        ...prev,
                        vitals: {...prev.vitals, oxygenSaturation: e.target.value}
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="painLevel">Pain Level (0-10)</Label>
                    <Input
                      id="painLevel"
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0"
                      value={patientData.vitals.painLevel}
                      onChange={(e) => setPatientData(prev => ({
                        ...prev,
                        vitals: {...prev.vitals, painLevel: e.target.value}
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Symptoms */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <span>Symptoms Assessment</span>
                </CardTitle>
                <CardDescription>Select all applicable symptoms (weighted scoring)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {symptoms.map((symptom) => (
                    <div key={symptom.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-accent/30 transition-smooth">
                      <Checkbox
                        id={symptom.id}
                        checked={patientData.selectedSymptoms.includes(symptom.id)}
                        onCheckedChange={(checked) => handleSymptomChange(symptom.id, !!checked)}
                      />
                      <div className="flex-1">
                        <label htmlFor={symptom.id} className="text-sm font-medium cursor-pointer">
                          {symptom.name}
                        </label>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">Score: {symptom.score}</span>
                          {symptom.critical && (
                            <Badge variant="destructive" className="text-xs">Critical</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Severity Score Card */}
          <div className="space-y-6">
            <Card className={`shadow-card border-2 ${severity.color === 'critical' ? 'border-critical shadow-critical' : severity.color === 'urgent' ? 'border-urgent shadow-urgent' : 'border-border'}`}>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <AlertTriangle className={`h-6 w-6 text-${severity.color}`} />
                  <span>Severity Assessment</span>
                </CardTitle>
                <CardDescription>Real-time triage scoring</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {backendResponse ? (
                  <div className="space-y-4 p-4 bg-accent/30 rounded-lg">
                    <div className="text-sm font-medium text-foreground">Backend Response:</div>
                    <div className="space-y-2">
                      <div className={`text-6xl font-bold text-${severity.color}`}>
                        {backendResponse.severityScore}
                      </div>
                      <Badge 
                        variant={backendResponse.priority === 'Critical' ? 'destructive' : 'secondary'}
                        className="text-lg px-4 py-1"
                      >
                        {backendResponse.priority}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        Patient ID: {backendResponse.id}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Wait Time: {backendResponse.estimatedWaitTime}
                      </div>
                      {backendResponse.triageNotes && (
                        <div className="text-xs text-muted-foreground mt-2">
                          {backendResponse.triageNotes}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className={`text-6xl font-bold text-${severity.color}`}>
                      {severityScore}
                    </div>
                    <Badge 
                      variant={severity.color === 'critical' ? 'destructive' : 'secondary'}
                      className={`text-lg px-4 py-1 ${severity.color === 'urgent' ? 'bg-urgent text-urgent-foreground' : severity.color === 'non-urgent' ? 'bg-non-urgent text-non-urgent-foreground' : ''}`}
                    >
                      {severity.category}
                    </Badge>
                  </div>
                )}

                {hasCriticalSymptoms && (
                  <div className="p-3 bg-critical/10 text-critical rounded-lg border border-critical/20">
                    <AlertTriangle className="h-4 w-4 mx-auto mb-1" />
                    <p className="text-xs font-medium">Critical symptoms detected</p>
                  </div>
                )}

                <div className="space-y-2 text-left">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Priority Level:</span>
                    <span className="ml-2 font-medium">{severity.priority}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Symptoms Selected:</span>
                    <span className="ml-2 font-medium">{patientData.selectedSymptoms.length}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Expected Wait:</span>
                    <span className="ml-2 font-medium">
                      {severity.category === 'Critical' ? 'Immediate' : 
                       severity.category === 'Urgent' ? '< 30 min' : '< 2 hours'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit to Backend'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;