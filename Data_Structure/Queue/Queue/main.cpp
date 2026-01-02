
// linkedlist ==> nodes
// queue ==> front rear
#include <iostream>

using namespace std;


class Node{
public :
    int data;
    Node * next;
    Node(int data)
    {
        this->data=data;
        this->next=NULL;
    }
};

class QueueLinkedList
{
    Node* rear;
    Node* front;

    public :
        QueueLinkedList()
        {
            rear=front=NULL;
        }

    void enQueue(int data )
    {

        //Create Node
        Node * newNode=new Node(data);
        newNode->next=NULL;

        // if empty
        if(rear==NULL)
        {
            front=rear=newNode;
            return ;
        }

        // Connection
        rear->next=newNode;
        rear= newNode;
    }

    void deQueue(void)
    {
        if(front == NULL ) return ;

        Node* temp= front;

        if(rear==front)  // last element rear == front  ==> delete then null
        {
            rear=front=NULL;
            delete temp;
            return ;
        }

        // connection
        front=front->next;
        delete temp;
    }

    void display(){
        Node * current= front;
        while(current != NULL)
        {
            cout<< current->data << "  ";
            current = current ->next;
        }

        cout<<endl<<"====================================="<<endl;
    }
};


int main()
{
    QueueLinkedList s;
    s.display();
    s.deQueue();
    s.enQueue(1);
    s.enQueue(11);
    s.enQueue(111);
    s.enQueue(1111);
    s.enQueue(11111);
    s.enQueue(111111);
    s.display();
    s.deQueue();
    s.deQueue();
    s.display();

    return 0;
}
