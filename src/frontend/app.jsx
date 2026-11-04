function App() {
    return (
    <>
        <nav className="nav" id="navigation">
            <div id="hero">
                <img src="images/logo.png" alt="No Image Found" width="25" height="50" /> 
                <h4>SAVE</h4>
                <p>Supporting Agriculture via Volunteer Engagement</p>
            </div>
            <div id="nav-buttons">
                <a href="#Home">Home</a>    
                <a href="#About">About</a>
                <a href="#Contact">Contact us</a>
                <a href="#Register">Register</a>
                <a href="#Help">Help</a>
            </div>
        </nav>

        <section id="Home">
            <div className="home-text">
                <h1>CULTIVATE CHANGE</h1>
                <h3>Volunteer to Support Sustainable Agriculture</h3>
                <p>
                    Connecting passionate individuals with local farms to provide hands-on help, strengthen food security, and grow resilient communities
                </p>
            </div>

            <div className="home-btn">
                <button>Register Here</button>
            </div>

            <div className="home-image">
                <img src="images/home-bg.jpg" alt="No Image Found" width="1000" /> 
            </div>
        </section> 

        <section id="About">
            <h2 className="about-title">About Our Program</h2>

            <div className="about-row">
                <div className="about-image">
                    <img src="images/about-img-1.jpg" alt="abt-img-1" />
                </div>

                <div className="about-text">
                    <p>
                        SAVE is a program dedicated to promoting the agricultural industry in the Philippines by engaging college students from different schools in volunteer activities on local farms. 
                    </p>
                </div>
            </div>

            <div className="about-row-reverse">
                <div className="about-image">
                    <img src="images/about-img-2.jpg" alt="abt-img-2" />
                </div>

                <div className="about-text">
                <p>
                    Through hands-on experience, students gain a deeper understanding of agriculture, develop a fresh perspective on the daily lives and challenges of Filipino farmers, and appreciate the vital role they play in the country's food production and agricultural development.
                </p>
                </div>
            </div>

            <div className="about-row">
                <div className="about-image">
                    <img src="images/about-img-3.jpg" alt="abt-img-3" />
                </div>
                <div className="about-text">
                <p>
                    Through hands-on experience, students gain a deeper understanding of agriculture, develop a fresh perspective on the daily lives and challenges of Filipino farmers, and appreciate the vital role they play in the country's food production and agricultural development.
                </p>
                </div>
            </div>
        </section>

        <section id="Register">
        <h1>Register Here!</h1>
        <form>
            <label htmlFor="full-name">Full Name:</label><br />
            <input type="text" id="full-name" name="full-name" /><br /><br />
            
            <label htmlFor="email">Email:</label><br />
            <input type="text" id="email" name="email" /><br /><br />
            
            <label htmlFor="subject">Subject:</label><br />
            <input type="text" id="subject" name="subject" /><br /><br />
            
            <button type="submit">Register</button>
        </form>
        </section>

        <section section id="footer">
        <div className="footer-contact">
            <h3>Contact Us</h3>
            <p>Address: Batangas City, Alangilan, Rene Subdiv</p>
            <p>Contact Number: 1928 - 211 - 2389</p>
        </div>
        
        <div className="footer-brand">
            <p>SAVE</p>
            <p>Supporting Agriculture via Volunteer Engagement</p>
        </div>
        </section>
    </>
    );
}
export default App;
