"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:3001";

export default function ProductsAdmin() {
    const queryClient = useQueryClient();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    // Queries
    const { data: products = [], isLoading: loadingProducts } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/products`);
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
        }
    });

    const { data: categories = [], isLoading: loadingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/categories`);
            if (!res.ok) throw new Error("Failed to fetch categories");
            return res.json();
        }
    });

    // Mutations
    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            const isEditing = !!payload.id;
            const url = isEditing ? `${API_URL}/products/${payload.id}` : `${API_URL}/products`;
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to save product");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            resetForm();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete product");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            id: editingId || undefined,
            name, slug, description,
            price: parseFloat(price),
            categoryId
        };
        mutation.mutate(payload);
    };

    const resetForm = () => {
        setEditingId(null);
        setName(""); setSlug(""); setDescription(""); setPrice(""); setCategoryId("");
    };

    const handleEdit = (prod: any) => {
        setEditingId(prod.id);
        setName(prod.name);
        setSlug(prod.slug);
        setDescription(prod.description || "");
        setPrice(prod.price);
        setCategoryId(prod.categoryId);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure?")) {
            deleteMutation.mutate(id);
        }
    };

    if (loadingProducts || loadingCategories) return <div className="p-8 text-center text-gray-500">Loading app data...</div>;

    return (
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Manage Products</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900">{editingId ? "Edit Product" : "Add New Product"}</h3>
                <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input required type="text" className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={name} onChange={e => { setName(e.target.value); if (!editingId) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')); }} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                        <input required type="text" className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={slug} onChange={e => setSlug(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input required type="number" step="0.01" className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select required className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                            <option value="">Select Category</option>
                            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} value={description} onChange={e => setDescription(e.target.value)}></textarea>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                        <button type="submit" disabled={mutation.isPending} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400">
                            {mutation.isPending ? "Saving..." : (editingId ? "Update" : "Create")}
                        </button>
                        {editingId && <button type="button" className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-6 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50" onClick={resetForm}>Cancel</button>}
                    </div>
                </form>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((prod: any) => (
                            <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{prod.name}</div>
                                    <div className="text-sm text-gray-500">{prod.slug}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{prod.category?.name || "None"}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="font-semibold text-gray-900">${prod.price}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md" onClick={() => handleEdit(prod)}>Edit</button>
                                        <button disabled={deleteMutation.isPending} className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md disabled:bg-red-100" onClick={() => handleDelete(prod.id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
