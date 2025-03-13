import { redirect } from "next/navigation";
import Form from "@/components/user/Form";
import { serverUserService } from "@/lib/supabase/server/user";

export default async function Profile() {
  const { data: userSetting, success: userSettingSuccess } = await serverUserService.getUserSetting()
  if (!userSettingSuccess || !userSetting) {
    redirect('/error')
  }

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Form 
          username={'username' in userSetting ? userSetting.username : ''}
          preferredEmail={'preferred_email' in userSetting ? userSetting.preferred_email : ''}
          userId={'user_id' in userSetting ? userSetting.user_id : ''}
        />
      </div>
    </div>
  )
}