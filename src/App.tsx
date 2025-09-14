import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { EmployeeForm } from "@/components/EmployeeForm";
import { EmployeeCard } from "@/components/EmployeeCard";
import { Plus } from "lucide-react";

interface Employee {
  _id: Id<"employees">;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: "active" | "inactive" | "terminated";
  phone?: string;
  address?: string;
}

function App() {
  const employees = useQuery(api.employees.getAll);
  const tasks = useQuery(api.tasks.getAll);
  const [activeTab, setActiveTab] = useState<"employees" | "tasks">("employees");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>();

  const handleAddEmployee = () => {
    setSelectedEmployee(undefined);
    setShowAddDialog(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditDialog(true);
  };

  const handleFormSuccess = () => {
    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedEmployee(undefined);
  };

  const handleFormCancel = () => {
    setShowAddDialog(false);
    setShowEditDialog(false);
    setSelectedEmployee(undefined);
  };

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Employee Management System</h1>
          <p className="text-muted-foreground">Built with Tauri 2.0 + React + shadcn/ui + Convex</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={activeTab === "employees" ? "default" : "outline"}
            onClick={() => setActiveTab("employees")}
          >
            Employees ({employees?.length || 0})
          </Button>
          <Button
            variant={activeTab === "tasks" ? "default" : "outline"}
            onClick={() => setActiveTab("tasks")}
          >
            Tasks ({tasks?.length || 0})
          </Button>
        </div>

        {activeTab === "employees" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Employee Directory</CardTitle>
                  <CardDescription>
                    Manage your organization's employees
                  </CardDescription>
                </div>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddEmployee} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Employee
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <EmployeeForm
                      mode="add"
                      onSuccess={handleFormSuccess}
                      onCancel={handleFormCancel}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {employees === undefined ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p>Loading employees...</p>
                  </div>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No employees found.</p>
                  <Button onClick={handleAddEmployee} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Your First Employee
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {employees.map((employee) => (
                    <EmployeeCard
                      key={employee._id}
                      employee={employee}
                      onEdit={handleEditEmployee}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "tasks" && (
          <Card>
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>
                Track and manage organizational tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasks === undefined ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p>Loading tasks...</p>
                  </div>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <Card key={task._id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className={`font-medium ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {task.text}
                          </h3>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                            {task.dueDate && (
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.isCompleted
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {task.isCompleted ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Employee Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedEmployee && (
              <EmployeeForm
                mode="edit"
                employee={selectedEmployee}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            )}
          </DialogContent>
        </Dialog>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Real-time connection to Convex backend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">Connected to Convex deployment: animated-kingfisher-893</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default App;
