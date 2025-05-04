export function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background-color: ${type === "success" ? "#4CAF70" : "#f44336"};
    color: white;
    border-radius: 24px;
    z-index: 1000;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

export function jsonToCsv(jsonData) {
  try {
    // the headers of the csv file
    const headers = Object.keys(jsonData[0]);

    const rows = jsonData.map((item) =>
      headers.map((header) => item[header]).join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "data.csv";

    link.click();

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return false;
  }
}
