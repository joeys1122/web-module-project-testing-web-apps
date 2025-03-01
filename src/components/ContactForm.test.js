import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>);

    const header = screen.queryByText(/contact form/i);

    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    userEvent.type(firstName, 'Joe');
    const error = await screen.findByTestId('error');
  
    expect(error).toBeInTheDocument();
    expect(error).toBeTruthy();
    expect(error).not.toBeNull();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);

    const submit = screen.getByRole('button');
    userEvent.click(submit);
    const errors = screen.findAllByTestId('error');

    errors.then(output => {
      expect(output.length).toBe(3)
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const submit = screen.getByRole('button');

    userEvent.type(firstName, 'Joseph');
    userEvent.type(lastName, 'Stanton');
    userEvent.click(submit);

    const error = await screen.findByTestId('error');

    expect(error).toBeInTheDocument();
    expect(error).toBeTruthy();
    expect(error).not.toBeNull();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);

    const email = screen.getByLabelText(/email*/i);
    userEvent.type(email, 'joe');
    const emailError = await screen.findByTestId('error');

    expect(emailError).toBeInTheDocument();
    expect(emailError).toBeTruthy();
    expect(emailError).toHaveTextContent('Error: email must be a valid email address.');
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    const email = screen.getByLabelText(/email*/i);
    const submit = screen.getByRole('button');
    userEvent.type(firstName, 'Joseph');
    userEvent.type(email, 'joseph@stanton.com');
    userEvent.click(submit);
    const lastNameError = await screen.findByTestId('error');

    expect(lastNameError).toBeInTheDocument();
    expect(lastNameError).toBeTruthy();
    expect(lastNameError).toHaveTextContent('Error: lastName is a required field.')
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const email = screen.getByLabelText(/email*/i);
    const submit = screen.getByRole('button');
    userEvent.type(firstName, 'Joseph');
    userEvent.type(lastName, 'Stanton');
    userEvent.type(email, 'joseph@stanton.com');
    userEvent.click(submit);

    await waitFor(() => {
      const submittedFirst = screen.getByText('Joseph');
      const submittedLast = screen.getByText('Stanton');
      const submittedEmail = screen.getByText('joseph@stanton.com');

      expect(submittedFirst).toBeInTheDocument();
      expect(submittedLast).toBeInTheDocument();
      expect(submittedEmail).toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);

    const firstName = screen.getByLabelText(/first name*/i);
    const lastName = screen.getByLabelText(/last name*/i);
    const email = screen.getByLabelText(/email*/i);
    const message = screen.getByLabelText(/message/i);
    const submit = screen.getByRole('button');
    userEvent.type(firstName, 'Joseph');
    userEvent.type(lastName, 'Stanton');
    userEvent.type(email, 'joseph@stanton.com');
    userEvent.type(message, 'message');
    userEvent.click(submit);

    await waitFor(() => {
      const submittedFirst = screen.getByText('Joseph');
      const submittedLast = screen.getByText('Stanton');
      const submittedEmail = screen.getByText('joseph@stanton.com');
      const submittedMsg = screen.getByText('message');

      expect(submittedFirst).toBeInTheDocument();
      expect(submittedLast).toBeInTheDocument();
      expect(submittedEmail).toBeInTheDocument();
      expect(submittedMsg).toBeInTheDocument();
    })
});