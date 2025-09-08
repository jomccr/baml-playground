(function($) {
    'use strict';
    
    $(document).ready(function() {
        console.log('Document ready, searching for Kadence posts blocks...');
        
        // Find all Kadence posts blocks
        const $blocks = $('.wp-block-kadence-posts.has-load-more');
        console.log('Found ' + $blocks.length + ' Kadence posts blocks');
        
        $blocks.each(function(index) {
            const $postsBlock = $(this);
            const blockId = $postsBlock.attr('id');
            const categories = $postsBlock.data('categories');
            const postsPerPage = $postsBlock.data('posts-per-page');
            
            console.log('Processing block ' + index + ':', {
                blockId: blockId,
                hasLoadMore: $postsBlock.hasClass('has-load-more'),
                categories: categories,
                postsPerPage: postsPerPage
            });
            
            // Find the load more button for this block
            const $loadMoreBtn = $('.kt-load-more[data-block-id="' + blockId + '"]');
            console.log('Load more button found:', $loadMoreBtn.length > 0);
            
            if ($loadMoreBtn.length) {
                $loadMoreBtn.on('click', function(e) {
                    e.preventDefault();
                    console.log('Load more clicked for block:', blockId);
                    
                    const $btn = $(this);
                    const page = parseInt($btn.data('page')) || 2;
                    
                    if (!$btn.prop('disabled')) {
                        $btn.prop('disabled', true).text('Loading...');
                        
                        const requestData = {
                            action: 'kadence_load_more_posts',
                            nonce: kadence_load_more_params.nonce,
                            page: page,
                            block_id: blockId,
                            categories: JSON.stringify(categories),
                            posts_per_page: postsPerPage
                        };
                        
                        console.log('Sending AJAX request:', requestData);
                        
                        $.ajax({
                            url: kadence_load_more_params.ajaxurl,
                            type: 'POST',
                            data: requestData,
                            success: function(response) {
                                console.log('Raw AJAX response:', response);
                                
                                try {
                                    if (response.success && response.data) {
                                        // Append directly to the block since it contains all posts
                                        $postsBlock.append(response.data);
                                        $btn.data('page', page + 1).prop('disabled', false).text('Load More');
                                        
                                        if (response.data.trim() === '') {
                                            console.log('No more posts available');
                                            $btn.remove();
                                            return;
                                        }
                                    } else {
                                        console.error('Invalid response structure:', response);
                                        $btn.prop('disabled', false).text('Try Again');
                                    }
                                } catch (e) {
                                    console.error('Error processing response:', e);
                                    $btn.prop('disabled', false).text('Try Again');
                                }
                            },
                            error: function(xhr, status, error) {
                                console.error('AJAX request failed:', {
                                    status: status,
                                    error: error,
                                    responseText: xhr.responseText,
                                    statusText: xhr.statusText
                                });
                                $btn.prop('disabled', false).text('Try Again');
                            }
                        });
                    }
                });
            }
        });
    });
})(jQuery); 