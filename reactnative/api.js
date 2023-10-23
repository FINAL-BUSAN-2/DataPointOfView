export async function healthPieChartData() {
  try {
    const response = await fetch('http://10.0.2.2:8000/health_piechartdata');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Error fetching chart data: ${error.message}`);
  }
}

export async function healthlistData() {
  try {
    const response = await fetch('http://10.0.2.2:8000/health_listdata');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Error fetching chart data: ${error.message}`);
  }
}

export async function pillPieChartData() {
  try {
    const response = await fetch('http://10.0.2.2:8000/pill_piechartdata');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Error fetching chart data: ${error.message}`);
  }
}

export async function pilllistData() {
  try {
    const response = await fetch('http://10.0.2.2:8000/pill_listdata');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Error fetching chart data: ${error.message}`);
  }
}
