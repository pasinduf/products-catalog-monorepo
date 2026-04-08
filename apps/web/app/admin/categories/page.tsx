"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/lib/config";
import { CategoryDto } from "@repo/types";


export default function CategoriesAdmin() {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    // Queries
    const { data: categories = [], isLoading } = useQuery<CategoryDto[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/categories`);
            if (!res.ok) throw new Error("Failed to fetch categories");
            return res.json();
        }
    });

    // Mutations
    const mutation = useMutation({
        mutationFn: async (payload: { id?: string; name: string; description: string }) => {
            const isEditing = !!payload.id;
            const url = isEditing ? `${API_URL}/categories/${payload.id}` : `${API_URL}/categories`;
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: payload.name, description: payload.description }),
            });
            if (!res.ok) throw new Error("Failed to save category");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setName("");
            setDescription("");
            setEditingId(null);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_URL}/categories/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete category");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ id: editingId || undefined, name, description });
    };

    const handleEdit = (category: any) => {
        setEditingId(category.id);
        setName(category.name);
        setDescription(category.description || "");
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading categories...</div>;

    return (
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Manage Categories</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900">{editingId ? "Edit Category" : "Add New Category"}</h3>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                required
                type="text"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400"
              >
                {mutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                    setDescription("");
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category: CategoryDto) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.description || <span className="italic text-gray-400">None</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md" onClick={() => handleEdit(category)}>
                        Edit
                      </button>
                      <button
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md disabled:bg-red-100"
                        onClick={() => handleDelete(category.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
}
