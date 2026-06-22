const [inventory, setInventory] = useState<number | null>(null);

const product = {
  id: "adamax",
  name: "ADAMAX",
  price: 75,
  quantity,
  image: "/images/adamaxblue.PNG",
};

const inStock = inventory !== null && inventory > 0;

useEffect(() => {
  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();

      if (!data.success) return;

      const adamax = data.products.find(
        (product: any) =>
          product.slug?.toLowerCase().includes("adamax") ||
          product.name?.toLowerCase().includes("adamax")
      );

      setInventory(adamax?.inventory ?? null);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };

  fetchInventory();
}, []);