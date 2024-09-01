import React, { useState, useEffect } from "react";
import axios from "axios";

const Recommend = ({ onRecommendations }) => {
  const [formData, setFormData] = useState({
    user_id: "",
    job_title: "",
    skills: "",
    degree: "",
    years_of_experience: "",
  });
  const [skillsList, setSkillsList] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [inputValueSkills, setInputValueSkills] = useState("");
  const [suggestionsSkills, setSuggestionsSkills] = useState([]);

  useEffect(() => {
    // Fetch skills from API
    const fetchSkills = async () => {
      try {
        const response = await axios.get("http://localhost:5005/skills");
        setSkillsList(response.data.skills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSkills((prev) =>
      checked ? [...prev, value] : prev.filter((skill) => skill !== value)
    );
    setFormData((prev) => ({
      ...prev,
      skills: selectedSkills.join(","),
    }));
  };

  const handleInputChangeSkills = (e) => {
    const { value } = e.target;
    setInputValueSkills(value);
    setSuggestionsSkills(
      skillsList.filter((skill) =>
        skill.skill_name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleAddSkill = (skillName) => {
    if (!selectedSkills.includes(skillName)) {
      setSelectedSkills((prev) => [...prev, skillName]);
      setFormData((prev) => ({
        ...prev,
        skills: [...selectedSkills, skillName].join(","),
      }));
      setInputValueSkills("");
      setSuggestionsSkills([]);
    }
  };

  const handleRemoveSkill = (skillName) => {
    setSelectedSkills((prev) => prev.filter((skill) => skill !== skillName));
    setFormData((prev) => ({
      ...prev,
      skills: selectedSkills.filter((skill) => skill !== skillName).join(","),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5005/recommend",
        formData
      );
      if (response.data.success) {
        onRecommendations(response.data.result);
      } else {
        alert("Error: " + response.data.error);
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input
            type="number"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Your Skills
          </label>
          <div className="relative flex">
            <input
              type="text"
              value={inputValueSkills}
              onChange={handleInputChangeSkills}
              placeholder="Start typing your skills"
              className="w-full p-2 text-black rounded-l-md border border-r-0 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
            />
            {suggestionsSkills.length > 0 && (
              <ul className="absolute z-10 bg-white text-black w-full border border-gray-300 rounded mt-1 max-h-60 overflow-y-scroll">
                {suggestionsSkills.map((skill) => (
                  <li
                    key={skill.id}
                    onClick={() => handleAddSkill(skill.skill_name)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {skill.skill_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-wrap gap-2 my-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="bg-white text-black py-1 px-3 rounded-sm cursor-pointer flex items-center border border-gray-300"
              >
                {skill}
                <span
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-red-500 font-bold cursor-pointer text-xl"
                >
                  &times;
                </span>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label>Degree:</label>
          <div>
            <input
              type="radio"
              id="no_degree"
              name="degree"
              value="No Degree"
              checked={formData.degree === "No Degree"}
              onChange={handleChange}
            />
            <label htmlFor="no_degree">No Degree</label>
          </div>
          <div>
            <input
              type="radio"
              id="bachelors"
              name="degree"
              value="Bachelor's"
              checked={formData.degree === "Bachelor's"}
              onChange={handleChange}
            />
            <label htmlFor="bachelors">Bachelor's</label>
          </div>
          <div>
            <input
              type="radio"
              id="masters"
              name="degree"
              value="Master's"
              checked={formData.degree === "Master's"}
              onChange={handleChange}
            />
            <label htmlFor="masters">Master's</label>
          </div>
        </div>
        <div>
          <label>Years of Experience:</label>
          <input
            type="number"
            name="years_of_experience"
            value={formData.years_of_experience}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Get Recommendations
        </button>
      </form>
    </div>
  );
};

export default Recommend;
