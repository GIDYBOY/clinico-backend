import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { Input } from "@/ui/Input";
import { Button } from "@/ui/Button";
import { baseApiUrl } from '@/utils/constants';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

const adminSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  username: z.string().min(3, "Username is required"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  gender: z.enum(["Male", "Female", "Other"], { message: "Gender is required" }),
  phone: z.string().min(10, "Phone number is too short"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  password: z.string()
  .regex(
    passwordRegex,
    "Password must be at least 6 characters \nPassword must include at least one uppercase, one lowercase, and one special character"
  ),
});

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function DeveloperAdminPanel() {
  const queryClient = useQueryClient();

  const [data, setData] = useState({
    name: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateData = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const { data: admins = [] } = useQuery<AdminUser[]>({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await fetch(`${baseApiUrl}/admin/users`, { credentials: "include" });
      return res.json();
    },
  });

  const createAdmin = useMutation({
    mutationFn: async () => {
      const result = adminSchema.safeParse(data);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
        throw new Error("Validation failed");
      }

      const {dateOfBirth} = data
      const correctDate = new Date(dateOfBirth).toISOString()

      const res = await fetch(`${baseApiUrl}/admin/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, dateOfBirth: correctDate }),
      });

      if (!res.ok) {
        throw Error("Failed")
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      // setData({ name: "", username: "", dateOfBirth: "", gender: "", phone: "", email: "", address: "", password: "" });
      alert("Admin created!");
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: async (id: string) => {
      return fetch(`${baseApiUrl}/admin/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50 justify-center items-center scroll mb-10">
      <h2 className="text-3xl font-bold text-gray-800 m-2">🛠 Developer Admin Panel</h2>

      {/* Create Admin Form */}
      <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md my-3 p-6 max-w-2xl space-y-6">
        <h3 className="text-xl font-semibold text-gray-700">Create New Admin</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ArrowRight color="#3B82F6" size={16} />
            <Input
              placeholder="Full Name"
              value={data.name}
              onChange={(e) => updateData("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm pl-6">{errors.name}</p>}

          <div className="flex items-center gap-2">
            <ArrowRight color="#3B82F6" size={16} />
            <Input
              placeholder="Username"
              value={data.username}
              onChange={(e) => updateData("username", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {errors.username && <p className="text-red-500 text-sm pl-6">{errors.username}</p>}

          <div className="flex items-center gap-2">
            <ArrowRight color="#3B82F6" size={16} />
            <Input
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => updateData("dateOfBirth", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {errors.dateOfBirth && <p className="text-red-500 text-sm pl-6">{errors.dateOfBirth}</p>}

          <div className="flex items-center gap-2">
            <ArrowRight color="#3B82F6" size={16} />
            <select
              value={data.gender}
              onChange={(e) => updateData("gender", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {errors.gender && <p className="text-red-500 text-sm pl-6">{errors.gender}</p>}

          <div className="flex items-center gap-2">
            <ArrowRight color="#3B82F6" size={16} />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={data.phone}
              onChange={(e) => updateData("phone", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm pl-6">{errors.phone}</p>}

          <div className="flex items-center gap-2">
            <ArrowRight color="#3B82F6" size={16} />
            <Input
              type="email"
              placeholder="Email Address"
              value={data.email}
              onChange={(e) => updateData("email", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm pl-6">{errors.email}</p>}

          <div className="flex items-center gap-2">
            <ArrowRight color="#3B82F6" size={16} />
            <Input
              placeholder="Residential Address"
              value={data.address}
              onChange={(e) => updateData("address", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {errors.address && <p className="text-red-500 text-sm pl-6">{errors.address}</p>}

          <div className="flex items-center gap-2">
            <ArrowRight color="#3B82F6" size={16} />
            <Input
              placeholder="Enter Password"
              value={data.password}
              type="password"
              onChange={(e) => updateData("password", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {errors.password && <p className="text-red-500 text-sm pl-6">{errors.password}</p>}
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => createAdmin.mutate()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Create Admin
          </Button>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow-md p-6 my-3 max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100 text-gray-600">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Joined</th>
                <th scope="col" className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{admin.name}</td>
                  <td className="px-6 py-4">{admin.email}</td>
                  <td className="px-6 py-4">{admin.role}</td>
                  <td className="px-6 py-4">{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <Button
                      variant="destructive"
                      onClick={() => deleteAdmin.mutate(admin.id)}
                      className="px-3 py-1 text-white bg-red-500 hover:bg-red-600 rounded text-xs"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">Global Settings</h3>
        <textarea
          placeholder="Maintenance Notice, Support Notes, etc..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <Button
          variant="secondary"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
        >
          Update Settings
        </Button>
      </div>
    </div>
  );
}