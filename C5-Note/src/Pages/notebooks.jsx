import { Link } from "react-router-dom";
import './notebooks.css';                        // Import CSS tied to this page
import logo from '../C5.png';

/***************************************
 * notebooks.jsx
 * 
 * Created 9/17/24 by - Lia
 * 
 * 
 */


export function PageNotebooks(){
    return(
        <>
            {/* Formatting the Note-Taking App via Flexbox
            * This layout below is the order for mobile viewing.
            * Desktop and midrange layouts are handled via CSS.
            */}
            <div className ="notebooksPageWrapper">

                {/* Header */}
                <header className="nbpHeader">
                    <img src={logo} className="nbpLogo" alt="C5-Note Logo" />
                    <span>C5-Note</span>
                </header>

                {/* Toolbar */}
                <div className="nbpToolbar">
                    <Link to="/"><button className="nbpButtonHome">C5-Note</button></Link>
                    <Link to="/"><button className="nbpButtonHome">C5-Note</button></Link>
                    <Link to="/"><button className="nbpButtonHome">C5-Note</button></Link>
                </div>
                <article className="nbpMain">
                    {/* Lorem Ipsum for filler until note pages implemented */}
                    <h1>Example Note Page</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec egestas mauris nec tortor rutrum venenatis. Quisque at commodo ante. Vivamus semper vehicula enim, vel vehicula felis varius ac. Suspendisse accumsan, quam non scelerisque egestas, nunc sem blandit lectus, eget feugiat magna orci vitae nunc. Phasellus eget velit at leo ullamcorper pharetra. Sed sapien sem, imperdiet vel augue eget, iaculis volutpat nunc. Aenean vel ultricies massa. Quisque at tellus convallis, tempor sem vitae, venenatis ligula. Quisque luctus leo ante, eget sodales nulla gravida vitae. Integer at tempor purus. Sed blandit placerat ullamcorper. Etiam sollicitudin sed ante eu tincidunt.</p>
                    <p>Ut imperdiet eros sodales felis pharetra sodales. Pellentesque est arcu, ornare vel sagittis quis, sollicitudin eget purus. Ut tempor nulla nisl, vel tristique dui egestas elementum. Integer vitae nisi risus. Nullam ac massa consectetur, aliquam augue id, venenatis diam. Phasellus accumsan tellus vestibulum, lacinia arcu ac, lobortis odio. Proin porta pharetra odio et consequat. Nam non vestibulum massa. Pellentesque porttitor dolor tortor, sed facilisis urna efficitur ut. Phasellus iaculis interdum nisl, et mattis lacus ullamcorper ac. Aenean quis convallis tortor, a finibus erat. Nunc aliquam lacus at rhoncus malesuada. Nam sagittis vitae tortor at sollicitudin. Duis suscipit nibh sit amet augue ultrices, ut fringilla sem scelerisque.</p>
                    <p>Aliquam pretium mauris orci, sit amet ornare urna fermentum eu. Pellentesque efficitur blandit placerat. Suspendisse a finibus sapien, id convallis sapien. Ut viverra lectus eu dui rhoncus interdum. Integer et leo at lorem porttitor pulvinar a non dolor. Aenean maximus augue risus, in dapibus est vehicula nec. Aliquam erat volutpat. Ut eu convallis mauris. Sed id gravida libero, ac varius neque.</p>
                    <p>Praesent vehicula interdum sagittis. Aliquam consequat erat velit, a eleifend mi vehicula pellentesque. Maecenas sodales, ante sed imperdiet lacinia, nibh velit pharetra mi, et lobortis erat neque in diam. Fusce luctus turpis quis ullamcorper semper. Pellentesque pellentesque fermentum vehicula. Proin eget lacus mi. Proin sit amet consequat libero. Aliquam nisl ante, finibus eu varius non, pulvinar in magna. Donec est urna, porta nec feugiat vitae, ultricies nec eros. Nam consequat magna consectetur dui condimentum iaculis. Vestibulum condimentum ipsum vel tincidunt elementum. Integer id euismod justo. Nullam consequat ipsum enim. Curabitur a suscipit neque. Suspendisse consequat pellentesque nisl vitae condimentum.</p>
                    <p>Donec ullamcorper sem turpis, vel fermentum libero rutrum vel. Donec id consectetur libero, id consequat neque. Nullam mi ligula, gravida sed ornare non, aliquet ut ligula. Ut egestas hendrerit ante non tristique. Donec scelerisque libero sit amet enim faucibus, imperdiet dignissim velit commodo. Suspendisse quis dictum odio. Aenean luctus vitae sem vitae malesuada. Duis posuere diam nec tincidunt iaculis. Vestibulum eu felis eget felis ullamcorper luctus et non sapien. Nullam sit amet enim sit amet eros accumsan ullamcorper. Pellentesque vestibulum interdum eros, sagittis fermentum sem pulvinar vitae. Proin vestibulum ante ullamcorper suscipit eleifend. Nam sit amet nulla non ligula bibendum scelerisque sed vel urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus laoreet magna libero, a consequat eros imperdiet eget. Interdum et malesuada fames ac ante ipsum primis in faucibus. </p>
                </article>
                <aside className="aside nbpSidebarNotebooks">
                    <h1>Notebooks</h1>
                    <p>My Notebook</p>
                    <p>CSE 442</p>
                </aside>
                <aside className="aside nbpSidebarPages">
                    <h1>Note Pages</h1>
                    <p>Lecture 2</p>
                    <p>Lecture 1</p>
                    <p>Syllabus</p>
                </aside>
                <footer className="nbpFooter">Footer</footer>

            </div>

        </>
    )
}