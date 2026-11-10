import Section from "../components/Section";

export default function RegisterPage() {
    return (
        <Section id="Register" tone="light">
            <h1>Register Here!</h1>
            <form>
                <label htmlFor="full-name">Full Name:</label><br />
                <input type="text" id="full-name" name="full-name" /><br /><br />

                <label htmlFor="email">Email:</label><br />
                <input type="email" id="email" name="email" /><br /><br />

                <label htmlFor="subject">Subject:</label><br />
                <input type="text" id="subject" name="subject" /><br /><br />

                <button type="submit">Register</button>
            </form>
        </Section>
    );
}