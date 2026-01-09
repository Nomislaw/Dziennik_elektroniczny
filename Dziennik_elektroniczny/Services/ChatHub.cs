using Microsoft.AspNetCore.SignalR;

namespace Dziennik_elektroniczny.DTOs;

public class ChatHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User.FindFirst("id")?.Value;
        if (userId != null)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }
    }
}
