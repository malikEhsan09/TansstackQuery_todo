import "./App.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Form from "./components/Form";

function App() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["todo"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8800/todo");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // Mutation to mark todo as complete
  const markCompleteMutation = useMutation({
    mutationFn: (id) => {
      return fetch("http://localhost:8800/todo/mark-complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["todo"]);
    },
    onError: (error) => {
      console.error("Error marking todo as complete:", error);
    },
  });

  const handleCheckboxChange = (item) => {
    // Call the mutation with the item ID
    markCompleteMutation.mutate(item.id);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <>
      <h2>Tanstack React Query</h2>
      <Form />
      {data?.data && data.data.length > 0 ? (
        data.data.map((item) => (
          <div key={item.id}>
            <input
              type="checkbox"
              checked={item.isCompleted}
              onChange={() => handleCheckboxChange(item)} // Handle checkbox change
            />
            <span
              style={{
                textDecoration: item.isCompleted ? "line-through" : "none",
              }}
            >
              {item.title || "Something went wrong while loading"}
            </span>
            <p>{item.id}</p>
          </div>
        ))
      ) : (
        <p>No items found.</p>
      )}
    </>
  );
}

export default App;
