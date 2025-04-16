import RegisterMovie from "./components/RegisterMovie";
import ListMovies from "./components/ListMovies";

function App() {
  return (
    <div>
      <h1>Movies</h1>
      <RegisterMovie />
      <hr />
      <ListMovies />
    </div>
  );
}

export default App;
