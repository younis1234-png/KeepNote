import Note from "./components/Note/Note";
import NoteList from "./components/NotesList/NotesList";
import SideNav from "./components/SideNav/SideNav";
import "./KeepNote.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NotesContext } from "./context/contex.js";
import { useReducer } from "react";
import NoteReducer from "./reducer/noteReducer";

function KeepNote() {
  const initialState = [];
  const [notes, notesDispatch] = useReducer(NoteReducer, initialState);

  return (
    <Router>
      <NotesContext.Provider value={{ notesState: notes, notesDispatch }}>
        <div className="keepNote">
          <SideNav />
          <Switch>
            <Route path="/all-notes">
              <NoteList title="All Notes" />
              <Route path="/all-notes/:id">
                <Note />
              </Route>
            </Route>
            <Route path="/trash">
              <NoteList title="Trash" />
              <Route path="/trash/:id">
                <Note />
              </Route>
            </Route>
          </Switch>
        </div>
      </NotesContext.Provider>
    </Router>
  );
}

export default KeepNote;
