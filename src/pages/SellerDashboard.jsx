import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthContext";
import { api } from "../api";

const EMPTY = { name: "", price: "", image: "", description: "" };

export default function SellerDashboard() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: EMPTY });

  const isSeller = user?.role === "seller";

  useEffect(() => {
    if (!isSeller) return;
    api
      .get("/products/mine")
      .then(setProducts)
      .catch((err) => setError(err.message));
  }, [isSeller]);

  if (!isSeller) return <Navigate to="/auth" replace />;

  async function onSubmit(data) {
    setError(null);
    try {
      if (editingId) {
        const updated = await api.put(`/products/${editingId}`, data);
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await api.post("/products", data);
        setProducts((prev) => [created, ...prev]);
      }
      cancelEdit();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    reset({
      name: p.name,
      price: p.price,
      image: p.image,
      description: p.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    reset(EMPTY);
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    setError(null);
    try {
      await api.del(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Seller Dashboard</h1>
        {error && <div className="error-message">{error}</div>}

        <h2 className="checkout-section-title">
          {editingId ? "Edit product" : "Add a product"}
        </h2>
        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Name</label>
            <input
              id="name"
              className="form-input"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <span className="form-error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="price">Price ($)</label>
            <input
              id="price"
              type="number"
              step="0.01"
              className="form-input"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                validate: (v) => !Number.isNaN(v) || "Enter a valid price",
                min: { value: 0, message: "Price can't be negative" },
              })}
            />
            {errors.price && <span className="form-error">{errors.price.message}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="image">Image URL</label>
            <input id="image" className="form-input" {...register("image")} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-input"
              rows={3}
              {...register("description")}
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Add Product"}
          </button>
          {editingId && (
            <button className="btn btn-secondary" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </form>

        <h2 className="checkout-section-title">Your products</h2>
        {products.length === 0 && <p>You haven't added any products yet.</p>}
        {products.map((p) => (
          <div className="checkout-item" key={p.id}>
            {p.image && (
              <img src={p.image} alt={p.name} className="checkout-item-image" />
            )}
            <div className="checkout-item-details">
              <h3 className="checkout-item-name">{p.name}</h3>
              <p className="checkout-item-price">${p.price.toFixed(2)}</p>
            </div>
            <button
              className="btn btn-secondary btn-small"
              onClick={() => startEdit(p)}
            >
              Edit
            </button>
            <button
              className="btn btn-secondary btn-small"
              onClick={() => handleDelete(p.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}