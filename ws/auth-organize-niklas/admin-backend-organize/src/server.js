const PORT = process.env.ADMIN_PORT || 4000;

app.use("/api/admin/auth", authRoutes);

app.use("/api/admin", authenticateAdmin, adminRoutes);

app.listen(PORT, () => {
  console.log(`Admin server running on port ${PORT}`);
});
