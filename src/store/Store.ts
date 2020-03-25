import File from './File';

export default class Store {
  public root: string;
  private files: File[] = [];

  clear() {
    this.files = [];
  }

  put(id: string) {
    let file = this.files
      .find(f => f.id === id);
    if(!file) {
      file = new File(this, id);
      this.files.push(file);
    }
    return file;
  }

  applyLiterals(src: string) {
    return this.files.reduce((acc, file) =>
      file.applyLiterals(acc), src);
  }

  get scripts() {
    return '<script>\n' + this.files.reduce((acc, file) =>
      acc + file.scripts, '') + '</script>\n';
  }

  get styles() {
    return '<style>\n' + this.files.reduce((acc, file) =>
      acc + file.styles, '') + '</style>\n';
  }
}
