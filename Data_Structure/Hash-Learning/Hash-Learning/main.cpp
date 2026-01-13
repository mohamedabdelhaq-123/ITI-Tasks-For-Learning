#include <iostream>

using namespace std;
class Node
{
public:
    Node*next;
    int data;

    Node(int data)
    {
        this->data=data;
        next=NULL;
    }

    ~Node()
    {

    }
};

class HashTable
{
private:
    int size;
    Node** table; //arr of ptrs to nodes

    int HashFunctionNumbers(int key)   // can fit chars by dealing it as ASCII
    {
        // key ==> #Func ===> index
        // if key is int ==========> wrapp depening on size
        // size =5 and key=2 ===> 2%5= index 2 ,,,, key=5 index 0 ,,,,, key=9 index4,,,,so on
        return key%size;
    }

    int HashFunctionString(string key)
    {
        /*int sum=0;
        for(char c: key)
            sum+=c;          // abc is like bca and cba
        return sum%size;*/

        int sum=0;
        for(char c: key)
            sum=(sum*31)+c;         // to diff. btw strings with prime number base to prevent pattern in data
        return sum%size;
    }

public:


    HashTable(int size)
    {
        this->size=size;
        // table=new Node [size];  ==> reserve array of nodes and ret ptr to array
        table=new Node*[size]; // ==> reserve array of pointers to node and ret ptr to ptr to array

        for(int i=0; i<size; i++)
            table[i]=NULL; // avoid wild pointer
    }



    void insertNode(int key)
    {
        int index=HashFunctionNumbers(key); // index
        Node* newNode=new Node(key);        // new node
        newNode->next=table[index];
        table[index]=newNode;                      // put in right place in table
    }

    bool searchNode(int key)
    {
        int index=HashFunctionNumbers(key); // index
        Node* current=table[index];
        while(current!=NULL)
        {
            if(current->data== key)
                return true;

            current=current->next;
        }
        return false;
    }

    bool removeNode(int key)
    {
        int index=HashFunctionNumbers(key); // index
        Node* current=table[index];
        Node* prev=NULL;
        while(current!=NULL)
        {
            if(current->data== key && prev!=NULL) // not first element
            {
                prev->next=current->next;
                current->next=NULL;
                delete current;
                return true;
            }
            else if(current->data== key && prev==NULL) // if first element
            {
                table[index]=current->next;
                current->next=NULL;
                delete current;
                return true;
            }

            prev=current;
            current=current->next;
        }
        return false;
    }

    void displayHashTable(void)
    {
        for(int i=0;i<size;i++)
        {
            cout<<"Index "<<i<<":  ";
            Node* current=table[i];
            while(current!=NULL)
            {
                cout<<current->data<<"  ";
                current=current->next;
            }
            cout<<endl;
        }
    }

    ~HashTable()
    {
        for(int i=0;i<size;i++)
        {
            Node* current=table[i];
            while(current!=NULL)
            {
                Node* temp= current;
                current=current->next;
                delete temp;
            }
        }
        delete [] table;
    }

};

int main()
{
    HashTable t(5);

    t.insertNode(0);
    t.insertNode(9);
    t.insertNode(10);
    t.insertNode(2);
    t.insertNode(5);
    t.insertNode(3);
    t.insertNode(1);
    t.insertNode(4);
    cout<<t.searchNode(22);
    cout<<t.searchNode(9);
    t.displayHashTable();
    cout << "Hello world!" << endl;
    return 0;
}
