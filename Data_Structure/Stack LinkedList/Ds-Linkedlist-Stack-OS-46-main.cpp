#include <iostream>

using namespace std;
class Exception{
public :
int code;
char * name ;
};
class Node{
public :
    int data;
    Node * prev;
    Node(int data){
        this->data=data;
        this->prev=NULL;
    }
};

class StackLinkedList{

    Node * tail ;
    public :
        StackLinkedList(){
            tail=NULL;
        }
    void push(int data ){
        //Create Node
        Node * newNode=new Node(data);
        newNode->prev=tail;
        // Connection
        tail= newNode;
    }
    int pop(  ){
        if(tail == NULL ){
            //cout<<"Error  Stack is Empty";
            Exception e;
            e.code=404;
            e.name="Stack Empty";
            throw e;
            //return -1;
        }
        Node * temp = tail;
        tail = tail -> prev;
        int data = temp -> data ;
        delete temp;
        return data;
    }

    void display(){
        Node * current= tail;
        cout<<"\n ============================ \n";
        while(current != NULL){
            cout<< current->data << "\t";
            current = current ->prev;
        }
        cout<<"\n ============================ \n";
    }
};


int main()
{
    StackLinkedList s;
    s.push(10);
    s.push(20);
    s.push(30);
    s.push(40);
    s.push(50);
    s.push(60);
    s.display();
    try{
        s.pop();//60
        s.pop(); // 50
        s.pop(); //40
        s.pop(); //30

    }catch (Exception e){
        cout<<e.name;
    }
     s.display();//20 10
    //cout << "Hello world!" << endl;
    return 0;
}
