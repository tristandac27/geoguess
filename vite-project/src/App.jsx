import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./HomePage";
import FlagQuiz from "./Flagquiz";
import Store from "./StorePage";
import Todo from "./Todo";
import Geoguess from "./geoguess";
import FavoriteGeo from "./favoritegeo";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/geoguess" element={<Geoguess />} />
        <Route path="/favoritegeo" element={<FavoriteGeo />} />
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/flagquiz" element={<FlagQuiz />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </Router>
  );
}

export default App;