import { StatusBar as Status } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  TextInput,
  Button,
} from 'react-native'

export default function App() {
  // Fetch data from jsonplaceholder function
  const [postList, setPosts] = useState([])
  // isLoading
  const [isLoading, setIsLoading] = useState(true)
  // Refreshing
  const [refreshing, setRefreshing] = useState(false)
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  // Post data
  const [isPosting, setIsPosting] = useState(false)

  const fetchData = async (limit = 10) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${limit}`
    )
    const data = await response.json()
    // console.log(data)
    setPosts(data)
    setIsLoading(false)
  }

  // handle Refresh
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData(20)
    setRefreshing(false)
  }

  const addPost = async () => {
    setIsPosting(true)
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: postTitle,
        body: postBody,
      }),
    })
    const newPost = await response.json()
    // console.log(data)
    setPosts([newPost, ...postList])
    setPostTitle('')
    setPostBody('')
    setIsPosting(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Activity Indicator
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Post title"
            value={postTitle}
            onChangeText={setPostTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Post Body"
            value={postBody}
            onChangeText={setPostBody}
          />
          <Button
            title={isPosting ? 'Adding...' : 'Add Post'}
            onPress={addPost}
            disabled={isPosting}
          />
        </View>
        <Status style="auto" />
        <View style={styles.listcontainer}>
          <FlatList
            data={postList}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.bodyText}>{item.body}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
            ListEmptyComponent={<Text>No Posts Found</Text>}
            ListHeaderComponent={
              <Text style={styles.headerText}>Post List</Text>
            }
            ListFooterComponent={
              <Text style={styles.footerText}>End of List</Text>
            }
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        </View>
      </>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: StatusBar.currentHeight,
  },
  listcontainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 16,
  },
  headerText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: StatusBar.currentHeight,
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    margin: 16,
  },
  input: {
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 8,
    height: 40,
    borderColor: '#333',
  },
})
