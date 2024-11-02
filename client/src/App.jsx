import "./App.css";
import { useQuery } from "@tanstack/react-query";
import Form from "./components/Form";

function App() {
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

  console.log("fetching daata", data);

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
              onChange={() => {}}
            />
            <span>{item.title || "No todo :("}</span>
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
