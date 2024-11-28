// Initialize the Quill editor
var quill = new Quill("#editor-container", {
  theme: "snow", // or 'bubble' theme
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
    ],
  },
});

// Load the existing post's body into Quill (render as HTML)
quill.root.innerHTML = `<%- data.body %>`; // Render the existing HTML content

// Log content to debug
console.log("Quill Content Loaded: ", quill.root.innerHTML);

// When submitting the form, store the Quill content in the hidden field
document.getElementById("edit-post-form").onsubmit = function (event) {
  // Log content before submission to debug
  console.log("Quill Content Before Submit: ", quill.root.innerHTML);

  // Set the hidden field with Quill's HTML content
  document.getElementById("body-input").value = quill.root.innerHTML;

  // Check if content is updated in hidden field
  console.log(
    "Hidden Body Field Content: ",
    document.getElementById("body-input").value
  );
};
