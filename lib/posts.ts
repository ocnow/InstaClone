import { supabase } from './supabase';
import { decode } from 'base64-arraybuffer';

export interface Post {
  id: string;
  caption: string;
  tags: string[];
  image_url: string;
  user_id: string;
  created_at: string;
  likes: number;
  liked_by_user: boolean;
}

interface StoryLike {
  user_id: string;
}

interface StoryWithLikes {
  id: string;
  caption: string;
  tags: string[];
  image_url: string;
  user_id: string;
  created_at: string;
  likes: [{ count: number }];
  liked_by_user: StoryLike[];
}

export async function uploadImage(uri: string): Promise<string> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = uri.split('/').pop() || new Date().getTime().toString();
    const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${new Date().getTime()}-${filename}`;

    // Convert blob to base64
    const fileReader = new FileReader();
    const getBase64 = new Promise<string>((resolve, reject) => {
      fileReader.onerror = () => {
        fileReader.abort();
        reject(new Error('Failed to read file'));
      };
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.readAsDataURL(blob);
    });

    const base64File = await getBase64;
    const base64Data = base64File.split(',')[1];
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('stories')
      .upload(path, decode(base64Data), {
        contentType: `image/${extension}`,
        cacheControl: '3600',
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }

    // Get the complete public URL
    const { data: { publicUrl } } = supabase.storage
      .from('stories')
      .getPublicUrl(path);

    console.log('Generated public URL:', publicUrl);

    // Add origin if URL is relative
    const finalUrl = publicUrl.startsWith('http') 
      ? publicUrl 
      : `${supabase.supabaseUrl}/storage/v1/object/public/${publicUrl}`;

    return finalUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function createPost(
  imageUrl: string,
  caption: string,
  tags: string,
): Promise<Post> {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data?.user) throw new Error('Not authenticated');

    // Ensure tags is always an array, even if empty
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

    const { data, error } = await supabase
      .from('stories')
      .insert({
        image_url: imageUrl,
        caption,
        tags: tagArray,
        user_id: user.data.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return { ...data, tags: data.tags || [] };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    const user = await supabase.auth.getUser();
    
    // Get all stories without inner join
    const { data: posts, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Then for each post, get like count and check if user liked it
    const postsWithLikes = await Promise.all((posts || []).map(async (post) => {
      const { count: likesCount } = await supabase
        .from('story_likes')
        .select('*', { count: 'exact', head: true })
        .eq('story_id', post.id);

      const { data: userLike } = await supabase
        .from('story_likes')
        .select('*')
        .eq('story_id', post.id)
        .eq('user_id', user.data?.user?.id)
        .maybeSingle();

      return {
        ...post,
        tags: post.tags || [], // Ensure tags is always an array
        likes: likesCount || 0,
        liked_by_user: !!userLike
      };
    }));

    return postsWithLikes;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function toggleLike(postId: string): Promise<void> {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data?.user) throw new Error('Not authenticated');

    const { data: existingLike, error: checkError } = await supabase
      .from('story_likes')
      .select()
      .eq('story_id', postId)
      .eq('user_id', user.data.user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('story_likes')
        .delete()
        .eq('story_id', postId)
        .eq('user_id', user.data.user.id);

      if (error) throw error;
    } else {
      // Like
      const { error } = await supabase
        .from('story_likes')
        .insert({
          story_id: postId,
          user_id: user.data.user.id
        });

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}