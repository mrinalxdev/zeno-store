const fs = require("fs").promises;

class PresistenceMiddleware {
  constructor(
    filePath = "state.json",
    options = { spaces: 2, fileType: "json", version: 1 }
  ) {
    this.filePath = filePath;
    this.options = options;
  }

  async saveState(state) {
    try {
      const { spaces, filePath } = this.options;
      const serializedState =
        filePath === "json"
          ? JSON.stringify(state, null, spaces)
          : state.toString();

      await fs.writeFile(this.filePath, serializedState);
    } catch (err) {
      console.error("Error saving: ", err.message);
    }
  }

  async loadState() {
    try {
      const fileContact = await fs.readFile(this.filePath, "utf-8");
      return this.parseFileContent(fileContact);
    } catch (err) {
      console.error("Error loading state: ", err.message);
      return null;
    }
  }

  async presistState(prevState, nextState) {
    await this.saveState(nextState);
  }

  parseFileContent(content) {
    try {
      const { fileType } = this.options;
      return fileType === "json" ? JSON.parse(content) : content;
    } catch (err) {
      console.error("Error while parsing file content :", err.message);
      return null;
    }
  }

  async renameFile(newFilePath) {
    try {
      await fs.rename(this.filePath, newFilePath);
      this.filePath = newFilePath;
    } catch (err) {
      console.error("Error renaming the file :", err.message);
    }
  }

  async deleteFile() {
    try {
        await fs.unlink(this.filePath)
    } catch (err) {
      console.error("Error while deleting the file :", err.message);
    }
  }

  setOptions(options){
    this.options = { ...this.options, ...options}
  }

  setFileType(fileType){
    this.options.fileType = fileType
  }

  setJsonFormatting(spaces){
    this.options.spaces = spaces
  }
  increamentVersion(){
    this.options.version += 1;
  }
}

module.exports = PresistenceMiddleware;
