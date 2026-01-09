#include <iostream>

using namespace std;

/*

//5. Remove All Nodes
    void RemoveALL(int data)
*/


// class node

// class linkedlist

// test


class Node
{
    // att
public:
    int data;  // templete
    Node* next;
    Node* prev;


    Node(int data)  // templ
    {
       this->data=data;
       next=NULL;
       prev=NULL;
    }


    // const

    // dest
    ~Node()
    {

    }

};

class LinkedList
{
private:
    Node* head;
    Node* tail;

public:
    // const
   /* LinkedList()                 // use parameterized to force to make node at begninnig
    {
        head=NULL; // at start
        tail=NULL;
    }*/

    LinkedList(int data)  // parameterized
    {
       // Node newNode;  ==> after func node is dead bec stack so heap
       // newNode->data=data;

        try
        {
            // node creation with data assignment
            Node* newNode= new Node(data);    // heap still remains
            head=newNode;
            tail=newNode;
            // prev and next null
        }
        catch (bad_alloc& e)
        {
            cout << "Error creating LinkedList: " << e.what() << endl;

            head=NULL; // at start
            tail=NULL;
        }


    }


    // methods

    void addNode(int data) // templ.
    {
        try
        {
            // node creation with data assignment
            Node* newNode= new Node(data);    // heap still remains

            // making connection
            tail->next=newNode;
            newNode->prev=tail;
            newNode->next=NULL;

            // remove connection
            tail=newNode;
        }
        catch (bad_alloc& e)
        {
            cout << "Error creating LinkedList: " << e.what() << endl;
        }
    }


    void displayLinkedList(void)
    {
        Node* current= head;
        int i=0;
        while(current!=NULL)
        {
            cout<<"Node "<<i<<" :"<<current->data<<endl;
            current=current->next;
            i++;
        }
    }


    int getCount(void)
    {
        // counter
        // loop on all list
        Node* current= head;
        int i=0;
        while(current!=NULL)
        {
            current=current->next;
            i++;
        }
        return i;
    }


     int getDataByIndex(int index)
     {
        if(getCount()<=index || index<0)   // if index out of range
            return -1;

        Node* current= head;
        int i=0,data=0;
        while(current!=NULL && i<index )  // loop till end of list or till needed index
        {
            current=current->next;
            i++;
        }
        return current->data;
     }


     void insertAfter(int data, int afterData)
     {
         // if in middle or at beginning
         Node* current = head;
         while(current!=NULL)
         {

             if(current->data==data)
             {
                 if(current->next!=NULL)
                 {
                     Node* newNode= new Node(afterData);  // node creation
                     newNode->next=current->next;   // next of newNode points to the next of current(contains data)
                     newNode->prev=current;          // prev of newNode points to the current
                     current->next=newNode;          // next of current points to newNode
                     current=current->next->next;    // to skip the newNode as next
                     current->prev=newNode;         // prev of the node after the newNode iserted points to the newNOde
                 }
                 else
                 {
                     addNode(afterData);          // if targetted data is at end
                 }
                 return;
             }
             current=current->next;
         }
         cout<<"Data Not found in LinkedList"<<endl; // if not presented
     }



    void InsertBefore(int data, int beforeData)
    {
        // if in middle or at beginning
         Node* current = head;
         while(current!=NULL)
         {

             if(current->data==data)
             {
                 Node* newNode= new Node(beforeData);  // node creation
                 if(current!=head)
                 {
                    newNode->next=current;
                    newNode->prev=current->prev;
                    current->prev->next=newNode;
                    current->prev=newNode;
                 }
                 else
                 {
                     // code
                     newNode->prev=NULL;
                     newNode->next=current;
                     current->prev=newNode;

                     head=newNode;
                     // head = newNode
                 }

                 return;
             }
             current=current->next;
         }
         cout<<"Data Not found in LinkedList"<<endl; // if not presented
    }


    void RemoveALL(int data)
    {
        Node* current = head;
        int flag=0;
         while(current!=NULL)
         {
             if(current->data==data)
             {
                 flag=1;
                 if(head==tail)
                 {
                     tail=head=NULL;
                     delete current;
                     current=NULL;
                     continue;
                 }
                 if(current==head)
                 {
                    head=head->next;    // head point to next
                    delete current;        // delete current
                    current=head;
                    current->prev=NULL;
                    cout<<"Head test"<<endl;
                    continue;

                 }
                 else if(current==tail)
                 {
                     // code
                     tail=tail->prev;
                     delete current;
                     current=tail;
                     current->next=NULL;
                     cout<<"tail test"<<endl;
                     continue;
                 }
                 else  // in middle
                 {
                     Node* temp=current->next;
                    current->prev->next=current->next;
                    current->next->prev=current->prev;
                    delete current;
                    current=temp;
                    cout<<"mid test"<<endl;
                    continue;
                 }

             }
            current=current->next;
         }
         if(flag==0)
         cout<<"Data Not found in LinkedList"<<endl; // if not presented
    }


    // dest
    ~LinkedList()
    {
        // code missing
        // delete all nodes after list dies
        Node* current= head;
        while(current!=NULL)
        {
            head=current->next;    // head point to next
            delete current;        // delete current
            current=head;          // assign head to current
        }
        tail=NULL;
    }

};

int main()
{
    cout << "Hello world!" << endl;

        LinkedList l(5);
        l.addNode(55);
        l.addNode(555);
        l.addNode(5555);
        l.addNode(55555);
        l.displayLinkedList();
        cout << "Count of LinkedList: "<< l.getCount()<<" Nodes" << endl;

        cout << "Data in index: "<< l.getDataByIndex(4) << endl;
        l.insertAfter(5,4);
        l.displayLinkedList();
        cout << "Count of LinkedList: "<< l.getCount()<<" Nodes" << endl;
                l.insertAfter(90,4);
        l.displayLinkedList();
        cout << "Count of LinkedList: "<< l.getCount()<<" Nodes" << endl;

        l.insertAfter(55555,74);
        l.displayLinkedList();
        cout << "Count of LinkedList: "<< l.getCount()<<" Nodes" << endl;



        l.InsertBefore(74,66);
       l.displayLinkedList();
        cout << "Count of LinkedList: "<< l.getCount()<<" Nodes" << endl;

        l.InsertBefore(55,66);
       l.displayLinkedList();
        cout << "Count of LinkedList: "<< l.getCount()<<" Nodes" << endl;

        l.InsertBefore(5,66);
       l.displayLinkedList();
        cout << "Count of LinkedList: "<< l.getCount()<<" Nodes" << endl;

         l.addNode(66);
                l.displayLinkedList();
        cout << "Count of LinkedList: "<< l.getCount()<<" Nodes" << endl;

         l.addNode(66);
                l.displayLinkedList();
        cout << "Count of LinkedList: "<< l.getCount()<<" Nodes" << endl;


        l.RemoveALL(66);
       l.displayLinkedList();
        cout << "Count of LinkedList: "<< l.getCount()<<" Nodes" << endl;


        LinkedList m(66);
               m.displayLinkedList();
        cout << "Count of LinkedList: "<< m.getCount()<<" Nodes" << endl;


        m.addNode(66);
               m.displayLinkedList();
        cout << "Count of LinkedList: "<< m.getCount()<<" Nodes" << endl;

                m.addNode(66);
               m.displayLinkedList();
        cout << "Count of LinkedList: "<< m.getCount()<<" Nodes" << endl;


        m.RemoveALL(66);
       m.displayLinkedList();
        cout << "Count of LinkedList: "<< m.getCount()<<" Nodes" << endl;







    return 0;
}
