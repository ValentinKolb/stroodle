import {Text} from '@mantine/core'
import {Switch, Link, Route} from "wouter";

function App() {

    return <Switch>

        <Route path="/">

            <Link to="/about">About</Link>

            <Text>Home v2</Text>

        </Route>

        <Route path="/about">

            <Link to="/">Home</Link>

            <Text>About</Text>

        </Route>

        <Route>
            404
        </Route>
    </Switch>
}

export default App
