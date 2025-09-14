import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit2, Trash2, Mail, Phone, MapPin } from "lucide-react";

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

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
}

export function EmployeeCard({ employee, onEdit }: EmployeeCardProps) {
  const deleteEmployee = useMutation(api.employees.remove);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEmployee({ id: employee._id });
    } catch (error) {
      console.error("Failed to delete employee:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "terminated":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(employee)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {employee.firstName} {employee.lastName}?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Department:</span>
            <span>{employee.department}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{employee.email}</span>
          </div>

          {employee.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{employee.phone}</span>
            </div>
          )}

          {employee.address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{employee.address}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Salary:</span>
            <span>${employee.salary.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Badge className={getStatusColor(employee.status)}>
            {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Hired: {new Date(employee.hireDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
}