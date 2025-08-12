import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bed, Search, Filter, Plus, Edit, User, Clock, MapPin, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, Bed as BedType } from "@/services/api";

const BedManagement = () => {
  const { toast } = useToast();
  const [beds, setBeds] = useState<BedType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<BedType | null>(null);
  
  const [assignmentData, setAssignmentData] = useState({
    patientId: "",
    patientName: "",
    estimatedDischarge: ""
  });

  useEffect(() => {
    loadBeds();
  }, []);

  const loadBeds = async () => {
    try {
      setLoading(true);
      const bedsData = await apiService.getBeds();
      setBeds(bedsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bed data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bedId: string, newStatus: BedType['status']) => {
    try {
      if (newStatus === 'occupied') {
        // Open assignment dialog for occupied status
        const bed = beds.find(b => b.id === bedId);
        if (bed) {
          setSelectedBed(bed);
          setIsAssignDialogOpen(true);
        }
        return;
      }

      const updatedBed = await apiService.updateBedStatus(bedId, newStatus);
      setBeds(prev => prev.map(bed => bed.id === bedId ? updatedBed : bed));
      
      toast({
        title: "Success",
        description: `Bed status updated to ${newStatus}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bed status",
        variant: "destructive"
      });
    }
  };

  const handlePatientAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed) return;

    try {
      const updatedBed = await apiService.updateBedStatus(
        selectedBed.id,
        'occupied',
        {
          patientId: assignmentData.patientId,
          patientName: assignmentData.patientName
        }
      );

      setBeds(prev => prev.map(bed => bed.id === selectedBed.id ? updatedBed : bed));
      
      toast({
        title: "Success",
        description: `Patient ${assignmentData.patientName} assigned to bed ${selectedBed.number}`
      });

      setIsAssignDialogOpen(false);
      setSelectedBed(null);
      setAssignmentData({ patientId: "", patientName: "", estimatedDischarge: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign patient to bed",
        variant: "destructive"
      });
    }
  };

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = 
      bed.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bed.patientName && bed.patientName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "all" || bed.type === filterType;
    const matchesStatus = filterStatus === "all" || bed.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'occupied': return 'secondary';
      case 'maintenance': return 'destructive';
      case 'cleaning': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'occupied': return 'text-blue-600';
      case 'maintenance': return 'text-red-600';
      case 'cleaning': return 'text-yellow-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'icu': return '🏥';
      case 'emergency': return '🚑';
      case 'general': return '🛏️';
      case 'isolation': return '🛡️';
      default: return '🛏️';
    }
  };

  const bedStats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'available').length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
    cleaning: beds.filter(b => b.status === 'cleaning').length
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading bed data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bed Management</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage hospital bed allocation</p>
        </div>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add New Bed
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Beds</p>
                <p className="text-2xl font-bold text-foreground">{bedStats.total}</p>
              </div>
              <Bed className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-green-600">{bedStats.available}</p>
              </div>
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupied</p>
                <p className="text-2xl font-bold text-blue-600">{bedStats.occupied}</p>
              </div>
              <User className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-2xl font-bold text-red-600">{bedStats.maintenance}</p>
              </div>
              <Edit className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cleaning</p>
                <p className="text-2xl font-bold text-yellow-600">{bedStats.cleaning}</p>
              </div>
              <Activity className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search beds by number, location, or patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="icu">ICU</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="isolation">Isolation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => (
          <Card key={bed.id} className={`shadow-card border-l-4 ${
            bed.status === 'available' ? 'border-l-green-500' :
            bed.status === 'occupied' ? 'border-l-blue-500' :
            bed.status === 'maintenance' ? 'border-l-red-500' :
            'border-l-yellow-500'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span className="text-xl">{getTypeIcon(bed.type)}</span>
                  <span>{bed.number}</span>
                </CardTitle>
                <Badge variant={getStatusVariant(bed.status)}>
                  {bed.status.charAt(0).toUpperCase() + bed.status.slice(1)}
                </Badge>
              </div>
              <CardDescription className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {bed.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="font-medium text-muted-foreground">Type:</span>
                <span className="ml-2 capitalize">{bed.type}</span>
              </div>
              
              {bed.status === 'occupied' && bed.patientName && (
                <div className="space-y-2 p-3 bg-accent/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{bed.patientName}</span>
                  </div>
                  {bed.assignedAt && (
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Assigned: {new Date(bed.assignedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {bed.estimatedDischarge && (
                    <div className="text-xs text-muted-foreground">
                      Expected discharge: {new Date(bed.estimatedDischarge).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Change Status:</Label>
                <Select value={bed.status} onValueChange={(value) => handleStatusChange(bed.id, value as BedType['status'])}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Patient to Bed</DialogTitle>
            <DialogDescription>
              Assign a patient to bed {selectedBed?.number}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePatientAssignment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                value={assignmentData.patientId}
                onChange={(e) => setAssignmentData(prev => ({...prev, patientId: e.target.value}))}
                placeholder="Enter patient ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                value={assignmentData.patientName}
                onChange={(e) => setAssignmentData(prev => ({...prev, patientName: e.target.value}))}
                placeholder="Enter patient name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedDischarge">Estimated Discharge (Optional)</Label>
              <Input
                id="estimatedDischarge"
                type="datetime-local"
                value={assignmentData.estimatedDischarge}
                onChange={(e) => setAssignmentData(prev => ({...prev, estimatedDischarge: e.target.value}))}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Assign Patient
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BedManagement;