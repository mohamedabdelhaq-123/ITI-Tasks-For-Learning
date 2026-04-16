public class BookAdapter implements Source{
    private JsonBook jsonBook;

    public BookAdapter(JsonBook jsonBook) {
        this.jsonBook = jsonBook;
    }

    @Override
    public Book getBook() {
        if(jsonBook==null){
            return null;
        }
        String json= jsonBook.getJsonData();
        String title=extractValue(json,"bookTitle");
        String author=extractValue(json,"authorName");
        int year=Integer.parseInt(extractValue(json,"year"));
        return new Book(title,author,year);
    }   

    private String extractValue(String json, String key) {
        String searchKey = "\"" + key + "\"";
        int start = json.indexOf(searchKey) + searchKey.length() + 2;
        int end = json.indexOf("\"", start + 1);  
        
        if (end == -1) {
            end = json.indexOf("}", start);
        }
        
        String value = json.substring(start, end);
        return value.replace("\"", "").trim();  
    }
}
