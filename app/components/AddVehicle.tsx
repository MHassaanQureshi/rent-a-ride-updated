"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Car, Bike, Truck, DollarSign, Palette, Fuel, FileText, Calendar, Upload, Plus, CheckCircle, X } from "lucide-react";

export default function AddVehicle() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const [formData, setformData] = useState({
    name: "",
    model: "",
    fuel_type: "",
    color: "",
    description: "",
    price: 0,
    Vehicletype: "",
    provider_id: session?.user.id,
    fromavailabilityDate: "",
    toavailabilityDate: "",
  });

  const [images, setimages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setimages(files);

    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setimages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const base64Images: string[] = [];
      for (const File of images) {
        const Converted = await toBase64(File);
        base64Images.push(Converted);
      }

      const res = await fetch("/api/vehicles", {
        method: "POST",
        body: JSON.stringify({ ...formData, image: base64Images }),
      });

      if (res.ok) {
        router.push("/listing");
      } else {
        setError("Failed to add vehicle. Please try again.");
      }
    } catch (e) {
      setError("An error occurred. Please try again later.");
      console.log("error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Add Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Vehicle</span>
          </h1>
          <p className="text-lg text-gray-600">List your vehicle and start earning today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Vehicle Type *</label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setformData({ ...formData, Vehicletype: "car" })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.Vehicletype === "car"
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Car className={`w-8 h-8 mx-auto mb-2 ${formData.Vehicletype === "car" ? "text-blue-600" : "text-gray-400"}`} />
                  <div className={`font-semibold ${formData.Vehicletype === "car" ? "text-blue-600" : "text-gray-700"}`}>Car</div>
                </button>

                <button
                  type="button"
                  onClick={() => setformData({ ...formData, Vehicletype: "bike" })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.Vehicletype === "bike"
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Bike className={`w-8 h-8 mx-auto mb-2 ${formData.Vehicletype === "bike" ? "text-blue-600" : "text-gray-400"}`} />
                  <div className={`font-semibold ${formData.Vehicletype === "bike" ? "text-blue-600" : "text-gray-700"}`}>Bike</div>
                </button>

                <button
                  type="button"
                  onClick={() => setformData({ ...formData, Vehicletype: "pickup" })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.Vehicletype === "pickup"
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Truck className={`w-8 h-8 mx-auto mb-2 ${formData.Vehicletype === "pickup" ? "text-blue-600" : "text-gray-400"}`} />
                  <div className={`font-semibold ${formData.Vehicletype === "pickup" ? "text-blue-600" : "text-gray-700"}`}>Pickup</div>
                </button>
              </div>
            </div>

            {/* Basic Details */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Vehicle Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Car className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Toyota Camry"
                    value={formData.name}
                    onChange={handleChange}
                    name="name"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Model *</label>
                <input
                  type="text"
                  placeholder="e.g., 2023"
                  value={formData.model}
                  onChange={handleChange}
                  name="model"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 bg-gray-50"
                  required
                />
              </div>
            </div>

            {/* Fuel Type and Color */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fuel Type *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Fuel className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Petrol, Diesel"
                    value={formData.fuel_type}
                    onChange={handleChange}
                    name="fuel_type"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Color *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Palette className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., Silver"
                    value={formData.color}
                    onChange={handleChange}
                    name="color"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 bg-gray-50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <div className="relative">
                <div className="absolute top-3 left-4 pointer-events-none">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  placeholder="Describe your vehicle's features and condition..."
                  value={formData.description}
                  onChange={handleChange}
                  name="description"
                  rows={4}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 bg-gray-50 resize-none"
                  required
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Rental Price *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                  name="price"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 bg-gray-50"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Enter the price per day in USD</p>
            </div>

            {/* Availability Dates */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Available From *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="fromavailabilityDate"
                    value={formData.fromavailabilityDate}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 bg-gray-50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Available Till *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="toavailabilityDate"
                    value={formData.toavailabilityDate}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 bg-gray-50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Images *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500 mb-4">PNG, JPG or WEBP (max. 5MB each)</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  name="image"
                  className="hidden"
                  id="image-upload"
                  required
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <Upload className="w-5 h-5" />
                  Select Images
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border-2 border-gray-200" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Vehicle...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  List Vehicle
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
