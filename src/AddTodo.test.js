import { render, screen, fireEvent } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import App from "./App";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("test that App component doesn't render dupicate Task", () => {
  render(<App />);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole("button", { name: /Add/i });
  const dateNow = Date().toLocaleString('en-US');
  fireEvent.change(inputTask, { target: { value: "Duplicate Test" } });
  fireEvent.change(inputDate, { target: { value: dateNow } });
  fireEvent.click(element);
  fireEvent.change(inputTask, { target: { value: "Duplicate Test" } });
  fireEvent.change(inputDate, { target: { value: dateNow } });
  fireEvent.click(element);
  const check = screen.getByText(/Duplicate Test/i);
  expect(check).toBe("Duplicate Test");
});

test("test that App component doesn't add a task without due date", () => {
  render(<App />);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const element = screen.getByRole("button", { name: /Add/i });
  fireEvent.change(inputTask, { target: { value: "Without Date Test" } });
  fireEvent.click(element);
  const check = screen.queryByText(/Without Date Test/i);
  expect(check).toBe(null);
});

test("test that App component doesn't add a task without task name", () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole("button", { name: /Add/i });
  const dateNow = Date().toLocaleString('en-US');
  fireEvent.change(inputDate, { target: { value: dateNow } });
  fireEvent.click(element);
  const check = screen.queryByText(new RegExp(dateNow, "i"));
  expect(check).toBe(null);
});

test("test that App component renders different colors for past due events", () => {
  render(<App />);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole("button", { name: /Add/i });
  const dateNow = Date().toLocaleString('en-US');
  fireEvent.change(inputTask, { target: { value: "Not Due Test" } });
  fireEvent.change(inputDate, { target: { value: dateNow } });
  fireEvent.click(element);
  const dateDue = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "Due Test" } });
  fireEvent.change(inputDate, { target: { value: dateDue } });
  fireEvent.click(element);
 
  const notDueColor = screen.getByTestId(/Not Due Test/i).style.background;
  const dueColor = screen.getByTestId(/Due Test/i).style.background;

  const check = (notDueColor !== dueColor);
  expect(check).toBe(true);
});

test("test that App component can be deleted thru checkbox", () => {
  render(<App />);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole("button", { name: /Add/i });
  const checkbox = screen.getByRole("checkbox");
  const dateNow = Date().toLocaleString('en-US');
  fireEvent.change(inputTask, { target: { value: "Checkbox Test" } });
  fireEvent.change(inputDate, { target: { value: dateNow } });
  fireEvent.click(element);
  fireEvent.click(checkbox);
  const check = screen.queryByText(/Checkbox Test/i);
  expect(check).toBe(null);
});
