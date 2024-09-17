import { Link } from "react-router-dom";
import './notebooks.css';                        // Import CSS tied to this page

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
            {/* Flexbox Testing Time */}
            <div class ="notebooksPageWrapper">

                <header class="nbpHeader">C5-Note</header>
                <article class="nbpMain">
                    <p>Lorem ipsum dolor sit amet.</p>
                </article>
                <aside class="aside nbpSidebarNotebooks">Notebooks</aside>
                <aside class="aside nbpSidebarPages">Note Pages</aside>
                <footer class="nbpFooter">Footer</footer>

            </div>

        </>
    )
}